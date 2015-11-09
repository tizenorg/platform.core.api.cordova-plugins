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
cordova.define('cordova-plugin-file.tizen.resolveLocalFileSystemURI', function(require, exports, module) {
// TODO: remove -> end

module.exports = {
  resolveLocalFileSystemURI: function(successCallback, errorCallback, args) {
    var path = args[0];
    // fix for file.spec.10
    path = path.split('?')[0];

    // fix for file.spec.12
    if (0 !== path.indexOf('file://')) {  // 'file://' scheme is required
      errorCallback && errorCallback(FileError.ENCODING_ERR);
      return;
    }

    function onResolve(file) {
      var filesystem = rootsUtils.findFilesystem(file.toURI());

      var entry = rootsUtils.createEntry(file, filesystem.filesystemName);
      entry.isDirectory = file.isDirectory;

      successCallback(entry);
    }

    function onError(error) {
      errorCallback && errorCallback(ConvErrorCode(error.code));
    }

    tizen.filesystem.resolve(path, onResolve, onError, 'r');
  }
};

//TODO: remove when added to public cordova repository -> begin
});
//TODO: remove -> end
