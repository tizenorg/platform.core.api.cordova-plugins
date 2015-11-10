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

// https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
function toUTF8Array(str) {
  var utf8 = [];
  for (var i = 0; i < str.length; ++i) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
    }
    else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f));
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                | (str.charCodeAt(i) & 0x3ff));
      utf8.push(0xf0 | (charcode >>18),
                0x80 | ((charcode>>12) & 0x3f),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f));
    }
  }
  return utf8;
}

module.exports = {
  write: function(successCallback, errorCallback, args) {
    var uri = args[0];
    var data = args[1];
    var position = args[2];
    var isBinary = args[3];

    if (!isBinary) {
      if ('string' === typeof data) {
        // convert to UTF-8, as this is the default encoding for read operations
        data = toUTF8Array(data);
      } else {
        // we don't support other types
        errorCallback && errorCallback(FileError.TYPE_MISMATCH_ERR);
        return;
      }
    } else {
      if (data instanceof ArrayBuffer) {
        var a = new Uint8Array(data);
        data = [];
        for (var i = 0; i < a.length; ++i) {
          data.push(a[i]);
        }
      } else {
        // we don't support other types
        errorCallback && errorCallback(FileError.TYPE_MISMATCH_ERR);
        return;
      }
    }

    var onSuccess = function (file) {
      if (file.isDirectory) {
        errorCallback && errorCallback(FileError.INVALID_MODIFICATION_ERR);
        return;
      }

      var openStreamSuccess = function (stream) {
        try {
          stream.position = position;
          stream.writeBytes(data);
          var length = stream.position - position;
          stream.close();

          // The cordova documentation points to: http://dev.w3.org/2009/dap/file-system/file-writer.html
          // This spec states that file length after write operation should be the greater of
          // (pre-write length) and (pre-write position + data.size), however
          // the cordova implementation sets it to the latter. In order to accommodate
          // for this, we need to truncate after write...
          module.exports.truncate(function() {
            successCallback && successCallback(length);
          }, errorCallback, [uri, stream.position]);
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
    var uri = rootsUtils.getFullPath(args[0]);
    var length = args[1];

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
