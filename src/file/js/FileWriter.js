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
cordova.define('cordova-plugin-file.tizen.FileWriter', function(require, exports, module) {
// TODO: remove -> end

var utils_ = xwalk.utils;
var native_ = new utils_.NativeManager(extension);

module.exports = {
  write: function(successCallback, errorCallback, args) {
    var uri = args[0];
    var data = args[1];
    var position = args[2];

    var onSuccess = function (file) {
      if (file.isDirectory) {
        errorCallback && errorCallback(FileError.INVALID_MODIFICATION_ERR);
        return;
      }

      var openStreamSuccess = function (stream) {
        try {
          stream.position = position;
          stream.write(data);
          var length = stream.position - position;
          stream.close();
          successCallback && successCallback(length);
        } catch (error) {
          errorCallback && errorCallback(ConvertTizenFileError(error));
        }
      }

      var openStreamError = function (error) {
        errorCallback && errorCallback(ConvertTizenFileError(error));
      }

      try {
        file.openStream('rw', openStreamSuccess, openStreamError);
      } catch (error) {
        errorCallback && errorCallback(ConvertTizenFileError(error));
      }
    }

    var onError = function (error) {
      errorCallback && errorCallback(ConvertTizenFileError(error));
    }

    try {
      tizen.filesystem.resolve(uri, onSuccess, onError, 'rw');
    } catch (error) {
      errorCallback && errorCallback(ConvertTizenFileError(error));
    }
  },

  truncate: function(successCallback, errorCallback, args) {
    var uriPrefix = 'file://';
    var uri = args[0];
    var length = args[1];

    if (uri.indexOf(uriPrefix) === 0) {
      uri = uri.substr(uriPrefix.length);
    }

    var callArgs = {
      'uri': uri,
      'length': length
    };

    var result = native_.callSync('File_truncate', callArgs);
    if (native_.isFailure(result)) {
      errorCallback && errorCallback(ConvertTizenFileError(native_.getErrorObject(result)));
    } else {
      successCallback && successCallback(length);
    }
  }
};

//TODO: remove when added to public cordova repository -> begin
});
//TODO: remove -> end
