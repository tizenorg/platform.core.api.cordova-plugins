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
cordova.define('cordova-plugin-file.tizen.Entry', function(require, exports, module) {
// TODO: remove -> end

var resolveParent = function(srcURL, errorCallback, rest){
  try {
    tizen.filesystem.resolve(
        srcURL,
        function (srcFile) {
          var parentDir = srcFile.parent;
          if (!parentDir) {
            console.error('Error - could not resolve file ' + srcURL);
            errorCallback && errorCallback(FileError.ENCODING_ERR);
          } else {
            rest(srcFile, parentDir);
          }
        }, function (err) {
          console.error('Error - resolve file ' + srcURL + ' failed');
          errorCallback && errorCallback(ConvertTizenFileError(err));
        },
    'r');
  } catch (exception) {
    console.error('Error - resolve ' + srcURL + ' file thrown exception');
    errorCallback && errorCallback(ConvertTizenFileError(exception));
  }
};

var changeFile = function(method, successCallback, errorCallback, args) {
  var srcURL = args[0];
  var name = args[2];
  var destURL = args[1] + ((args[1][args[1].length-1] === '/') ? '' : '/') + name;

  resolveParent (srcURL, errorCallback,
      function(srcFile, parentDir) {
          try {
            parentDir[method](srcFile.fullPath,
                destURL,
                false,
                function () {
                  try {
                    tizen.filesystem.resolve(
                      destURL,
                      function (destFile) {
                        var destEntry = rootsUtils.createEntry(destFile);
                        destEntry.isDirectory = destFile.isDirectory;
                        successCallback && successCallback(destEntry);
                      }, function (err) {
                        console.error('Error - resolve result entry failed');
                        errorCallback && errorCallback(ConvertTizenFileError(err));
                      }
                    );
                  } catch (exception) {
                    console.error('Error - resolve result entry thrown exception');
                    errorCallback && errorCallback(ConvertTizenFileError(exception));
                  }
                }, function (err) {
                  console.error('Error - ' + method + ' operation failed');
                  errorCallback && errorCallback(ConvertTizenFileError(err));
                }
            );
          } catch (exception) {
            console.error('Error - ' + method + ' operation thrown exception');
            errorCallback && errorCallback(ConvertTizenFileError(exception));
          }
      }
  );
};

module.exports = {
  getFileMetadata: function(successCallback, errorCallback, args) {
      try {
        tizen.filesystem.resolve(args[0], function (file) {
          var result = { 'size': file.fileSize, 'lastModifiedDate': file.modified };
          successCallback && successCallback(result);
        }, function (err) {
          errorCallback && errorCallback(ConvertTizenFileError(err));
        }, 'r');
      } catch (exception) {
        console.error('Error - resolve failed');
        errorCallback && errorCallback(ConvertTizenFileError(exception));
      }
    },
  setMetadata: function(successCallback, errorCallback, args) {
    console.error('setMetadata - Not supported');
    errorCallback && errorCallback(FileError.ENCODING_ERR);
  },
  moveTo: function(successCallback, errorCallback, args) {
    changeFile('moveTo', successCallback, errorCallback, args);
  },
  copyTo: function(successCallback, errorCallback, args) {
    changeFile('copyTo', successCallback, errorCallback, args);
  },
  remove: function(successCallback, errorCallback, args) {
    var url = args[0];

    if (rootsUtils.isRootUri(url)) {
      console.error('It is not allowed to remove root directory.');
      errorCallback && errorCallback(FileError.NO_MODIFICATION_ALLOWED_ERR);
      return;
    }

    resolveParent(url,  errorCallback,
        function(srcFile, parentDir){
          var method = srcFile.isFile ? 'deleteFile' : 'deleteDirectory';
          var args = [srcFile.fullPath,
                      false,
                      function() {successCallback && successCallback();},
                      function(err) {
                        console.error('Error - ' + method + ' failed');
                        errorCallback && errorCallback(ConvertTizenFileError(err));
                        }];
          if (srcFile.isFile) {
            //remove recursive flag
            args.splice(1, 1);
          }
          try {
            parentDir[method].apply(parentDir, args);
          } catch (exception) {
            console.error('Error - ' + method + ' thrown exception ' + JSON.stringify(exception));
            errorCallback && errorCallback(ConvertTizenFileError(exception));
          }
        }
    );
  },
  getParent: function(successCallback, errorCallback, args) {
    var url = args[0];
    console.log('url ' + url);

    resolveParent(url, errorCallback,
        function(srcFile, parentDir){
          successCallback && successCallback(rootsUtils.createEntry(srcFile.parent));
        }
    );
  }
};

//TODO: remove when added to public cordova repository -> begin
});
//TODO: remove -> end
