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

var _global = window || global || {};


/**
 * FileTransferError
 * @constructor
 */
var FileTransferError = function(code, source, target, status, body, exception) {
    this.code = code || null;
    this.source = source || null;
    this.target = target || null;
    this.http_status = status || null;
    this.body = body || null;
    this.exception = exception || null;
};

FileTransferError.FILE_NOT_FOUND_ERR = 1;
FileTransferError.INVALID_URL_ERR = 2;
FileTransferError.CONNECTION_ERR = 3;
FileTransferError.ABORT_ERR = 4;
FileTransferError.NOT_MODIFIED_ERR = 5;


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


var FileUploadResult = function() {
    this.bytesSent = 0;
    this.responseCode = null;
    this.response = null;
};


/**
 * Options to customize the HTTP request used to upload files.
 * @constructor
 * @param fileKey {String}   Name of file request parameter.
 * @param fileName {String}  Filename to be used by the server. Defaults to image.jpg.
 * @param mimeType {String}  Mimetype of the uploaded file. Defaults to image/jpeg.
 * @param params {Object}    Object with key: value params to send to the server.
 * @param headers {Object}   Keys are header names, values are header values. Multiple
 *                           headers of the same name are not supported.
 */
var FileUploadOptions = function(fileKey, fileName, mimeType, params, headers, httpMethod) {
    this.fileKey = fileKey || null;
    this.fileName = fileName || null;
    this.mimeType = mimeType || 'image/jpeg';
    this.params = params || null;
    this.headers = headers || null;
    this.httpMethod = httpMethod || null;
};


function getUrlCredentials(urlString) {
  var credentialsPattern = /^https?\:\/\/(?:(?:(([^:@\/]*)(?::([^@\/]*))?)?@)?([^:\/?#]*)(?::(\d*))?).*$/,
      credentials = credentialsPattern.exec(urlString);

  return credentials && credentials[1];
}


function getBasicAuthHeader(urlString) {
  var header =  null;

  // This is changed due to MS Windows doesn't support credentials in http uris
  // so we detect them by regexp and strip off from result url
  // Proof: http://social.msdn.microsoft.com/Forums/windowsapps/en-US/a327cf3c-f033-4a54-8b7f-03c56ba3203f/windows-foundation-uri-security-problem

  if (window.btoa) {
    var credentials = getUrlCredentials(urlString);
    if (credentials) {
      var authHeader = "Authorization";
      var authHeaderValue = "Basic " + window.btoa(credentials);

      header = {
        name : authHeader,
        value : authHeaderValue
      };
    }
  }
  return header;
}


var FileTransfer = function() {
  this._downloadId = 0;
  this.onprogress = null;   // optional callback
};


/**
* Given an absolute file path, uploads a file on the device to a remote server
* using a multipart HTTP request.
* @param filePath {String}           Full path of the file on the device
* @param server {String}             URL of the server to receive the file
* @param successCallback (Function}  Callback to be invoked when upload has completed
* @param errorCallback {Function}    Callback to be invoked upon error
* @param options {FileUploadOptions} Optional parameters such as file name and mimetype
*/
FileTransfer.prototype.upload = function(filePath, server, successCallback, errorCallback, options, trustAllHosts) {
  // TODO - check arguments

  var fileKey = null;
  var fileName = null;
  var httpMethod = null;
  var mimeType = null;
  var params = null;
  var chunkedMode = true;
  var headers = null;

  var basicAuthHeader = getBasicAuthHeader(server);
  if (basicAuthHeader) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers[basicAuthHeader.name] = basicAuthHeader.value;
  }

  if (options) {
    fileKey = options.fileKey;
    fileName = options.fileName;
    mimeType = options.mimeType;
    headers = options.headers;
    if (httpMethod.toUpperCase() === "PUT"){
      httpMethod = "PUT";
    } else {
      httpMethod = "POST";
    }
    if (options.chunkedMode !== null || typeof options.chunkedMode !== "undefined") {
      chunkedMode = options.chunkedMode;
    }
    params = options.params || {};
  }

  function successCB(entry) {
    if (entry.isFile) {
      entry.file( function(file) {
        function uploadFile(blobFile) {
          var fd = new FormData();

          fd.append(fileKey, blobFile, fileName);

          for (var prop in params) {
            if(params.hasOwnProperty(prop)) {
               fd.append(prop, params[prop]);
            }
          }
          var xhr = new XMLHttpRequest();

          xhr.open("POST", server);

          xhr.onload = function(evt) {
            if (xhr.status == 200) {
              var result = new FileUploadResult();
              result.bytesSent = file.size;
              result.responseCode = xhr.status;
              result.response = xhr.response;
              successCallback(result);
            } else if (xhr.status == 404) {
              if (errorCallback) {
                errorCallback(new FileTransferError(FileTransferError.INVALID_URL_ERR));
              }
            } else {
              if (errorCallback) {
                errorCallback(new FileTransferError(FileTransferError.CONNECTION_ERR));
              }
            }
          };

          xhr.ontimeout = function(evt) {
            if (errorCallback) {
              errorCallback(new FileTransferError(FileTransferError.CONNECTION_ERR));
            }
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
        if (errorCallback) {
          errorCallback(new FileTransferError(FileTransferError.CONNECTION_ERR));
        }
      });
    }
  }

  function errorCB() {
    if (errorCallback) {
      errorCallback(new FileTransferError(FileTransferError.CONNECTION_ERR));
    }
  }

  window.webkitResolveLocalFilSystemURL(filePath, successCB, errorCB);
};


/**
 * Downloads a file form a given URL and saves it to the specified directory.
 * @param source {String}          URL of the server to receive the file
 * @param target {String}         Full path of the file on the device
 * @param successCallback (Function}  Callback to be invoked when upload has completed
 * @param errorCallback {Function}    Callback to be invoked upon error
 * @param trustAllHosts not used
 * @param options {FileDownloadOptions} Optional parameters such as headers
 */
FileTransfer.prototype.download = function(source, target, successCallback, errorCallback, trustAllHosts, options) {
  // TODO - check arguments
  var self = this;

  var basicAuthHeader = getBasicAuthHeader(source);
  if (basicAuthHeader) {
    source = source.replace(getUrlCredentials(source) + '@', '');

    options = options || {};
    options.headers = options.headers || {};
    options.headers[basicAuthHeader.name] = basicAuthHeader.value;
  }

  var headers = null;
  if (options) {
    headers = options.headers || null;
  }

  var listener = {
    onprogress: function(id, receivedSize, totalSize) {
      if (self.onprogress) {
        return self.onprogress(new ProgressEvent());
      }
    },
    onpaused: function(id) {
      // TODO not needed in filetransfer cordova plugin
    },
    oncanceled: function(id) {
      if (errorCallback) {
        errorCallback(new FileTransferError(FileTransferError.ABORT_ERR));
      }
    },
    oncompleted: function(id, fullPath) {
      if (successCallback) {
        // TODO filesystem plugin should be implemented in order to pass the argument
        // of successCallback.  Temporary null used instead
        successCallback(null);
      }
    },
    onfailed: function(id, error) {
      if (errorCallback) {
        errorCallback(new FileTransferError(TizenErrCodeToErrCode(error.code)));
      }
    }
  };

  var idx = target.lastIndexOf('/');
  var targetPath = target.substr(0, idx);
  var targetFilename = target.substr(idx + 1);

  var downloadRequest = new tizen.DownloadRequest(source, targetPath, targetFilename, 'ALL', headers);
  self._downloadId = tizen.download.start(downloadRequest, listener);
};


/**
 * Aborts the ongoing file transfer on this object. The original error
 * callback for the file transfer will be called if necessary.
 */
FileTransfer.prototype.abort = function() {
  if (this._downloadId) {
    tizen.download.cancel(this._downloadId);
  }
};

_global.FileUploadResult = FileUploadResult;
_global.FileTransfer = FileTransfer;
_global.FileTransferError = FileTransferError;
_global.FileUploadOptions = FileUploadOptions;

console.log('Loaded FileTransfer API');
