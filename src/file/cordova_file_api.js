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

var native_ = new xwalk.utils.NativeManager(extension);

function FileManager() {}

FileManager.prototype.truncate = function(uri, length, successCallback, errorCallback) {
  var callArgs = {
    'uri': uri,
    'length': length
  };

  var result = native_.callSync('File_truncate', callArgs);
  if (native_.isFailure(result)) {
    if (errorCallback) {
      errorCallback(native_.getErrorObject(result));
    }
  } else {
    if (successCallback) {
      successCallback(length);
    }
  }
};

exports = new FileManager();
