/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd All Rights Reserved
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

// TODO: remove when added to public cordova repository -> begin
var plugin_name = 'cordova-plugin-file.tizen.FileTransfer';

cordova.define(plugin_name, function(require, exports, module) {
// TODO: remove -> end

function TizenErrCodeToErrCode(err_code) {
  switch (err_code) {
    case WebAPIException.NOT_FOUND_ERR:
      return FileTransferError.FILE_NOT_FOUND_ERR;

    case WebAPIException.URL_MISMATCH_ERR:
      return FileTransferError.INVALID_URL_ERR;

    case WebAPIException.NETWORK_ERR:
      return FileTransferError.CONNECTION_ERR;

    case WebAPIException.ABORT_ERR:
      return FileTransferError.ABORT_ERR;

    default:
      return FileTransferError.NOT_MODIFIED_ERR;
  }
}

var uploads = {};
var downloads = {};

exports = {
  upload: function(successCallback, errorCallback, args) {
    var filePath = args[0],
        server = args[1],
        fileKey = args[2],
        fileName = args[3],
        mimeType = args[4],
        params = args[5],
        trustAllHosts = args[6],  // not used
        chunkedMode = args[7],
        headers = args[8],
        id = args[9],
        httpMethod = args[10];

    var fail = function(code, status, response) {
      uploads[id] && delete uploads[id];
      var error = new FileTransferError(code, filePath, server, status, response);
      errorCallback && errorCallback(error);
    };

    function successCB(entry) {
      if (entry.isFile) {
        entry.file(function(file) {
          function uploadFile(blobFile) {
            var fd = new FormData();

            fd.append(fileKey, blobFile, fileName);

            for (var prop in params) {
              if(params.hasOwnProperty(prop)) {
                 fd.append(prop, params[prop]);
              }
            }
            var xhr = uploads[id] = new XMLHttpRequest();

            xhr.open(httpMethod, server);

            // Fill XHR headers
            for (var header in headers) {
              if (headers.hasOwnProperty(header)) {
                xhr.setRequestHeader(header, headers[header]);
              }
            }

            xhr.onload = function(evt) {
              if (xhr.status === 200) {
                uploads[id] && delete uploads[id];
                successCallback({
                  bytesSent: file.size,
                  responseCode: xhr.status,
                  response: xhr.response
                });
              } else if (xhr.status == 404) {
                fail(FileTransferError.INVALID_URL_ERR, this.status, this.response);
              } else {
                fail(FileTransferError.CONNECTION_ERR, this.status, this.response);
              }
            };

            xhr.ontimeout = function(evt) {
              fail(FileTransferError.CONNECTION_ERR, this.status, this.response);
            };

            xhr.onerror = function() {
              fail(FileTransferError.CONNECTION_ERR, this.status, this.response);
            };

            xhr.onabort = function () {
              fail(FileTransferError.ABORT_ERR, this.status, this.response);
            };

            xhr.upload.onprogress = function (e) {
              successCallback(e);
            };

            xhr.send(fd);
          }

          var bytesPerChunk;

          if (options.chunkedMode === true) {
            bytesPerChunk = 1024 * 1024; // 1MB chunk sizes.
          } else {
            bytesPerChunk = file.size;
          }
          var start = 0;
          var end = bytesPerChunk;
          while (start < file.size) {
            var chunk = file.webkitSlice(start, end, mimeType);
            uploadFile(chunk);
            start = end;
            end = start + bytesPerChunk;
          }
        }, function(error) {
          fail(FileTransferError.CONNECTION_ERR);
        });
      }
    }

    function errorCB() {
      fail(FileTransferError.CONNECTION_ERR);
    }

    window.webkitResolveLocalFilSystemURL(filePath, successCB, errorCB);
  },
  download: function(successCallback, errorCallback, args) {
    var source = args[0],
        target = args[1],
        trustAllHosts = args[2],  // not used
        id = args[3],
        headers = args[4];

    var fail = function(code) {
      downloads[id] && delete downloads[id];
      var error = new FileTransferError(code, source, target);
      errorCallback && errorCallback(error);
    }

    var listener = {
      onprogress: function(id, receivedSize, totalSize) {
        successCallback({
          lengthComputable: true,
          loaded: receivedSize,
          total: totalSize
        });
      },
      onpaused: function(id) {
        // not needed in file-transfer plugin
      },
      oncanceled: function(id) {
        fail(FileTransferError.ABORT_ERR);
      },
      oncompleted: function(id, fullPath) {
        if (successCallback) {
          // TODO: success callback should receive FileEntry Object
          successCallback(null);
        }
      },
      onfailed: function(id, error) {
        fail(TizenErrCodeToErrCode(error.code));
      }
    };

    var idx = target.lastIndexOf('/');
    var targetPath = target.substr(0, idx);
    var targetFilename = target.substr(idx + 1);

    var downloadRequest = new tizen.DownloadRequest(source, targetPath, targetFilename, 'ALL', headers);
    downloads[id] = tizen.download.start(downloadRequest, listener);
  },
  abort: function(successCallback, errorCallback, args) {
    var id = args[0];
    if (uploads[id]) {
      uploads[id].abort();
      delete uploads[id];
    } else if (downloads[id]) {
      tizen.download.cancel(downloads[id]);
      delete downloads[id];
    } else {
      console.warn('Unknown file transfer ID: ' + id);
    }
  },
};

require("cordova/exec/proxy").add("FileTransfer", exports);

console.log('Loaded cordova.file-transfer API');

//TODO: remove when added to public cordova repository -> begin
});

exports = function(require) {
  // this plugin is not loaded via cordova_plugins.js, we need to manually add
  // it to module mapper
  var mm = require('cordova/modulemapper');
  mm.runs(plugin_name);
};
//TODO: remove -> end
