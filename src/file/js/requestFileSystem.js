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
cordova.define('cordova-plugin-file.tizen.requestFileSystem', function(require, exports, module) {
// TODO: remove -> end

module.exports = {
  requestFileSystem: function(successCallback, errorCallback, args) {
    var type = args[0];

    //TEMPORARY = 0 PERSISTENT = 1 cordova layer checks only if type is less than 0
    if (type >= 2) {
      errorCallback && errorCallback(FileError.TYPE_MISMATCH_ERR);
      return;
    }

    var path = type === LocalFileSystem.PERSISTENT ?
        cordova.file.dataDirectory : cordova.file.cacheDirectory;

    var filesystem = rootsUtils.findFilesystem(path.substr(0, path.length-1));

    if (filesystem.filesystemName !== 'temporary' && filesystem.filesystemName !== 'persistent') {
      errorCallback && errorCallback(FileError.NOT_FOUND_ERR);
      return;
    }

    var root = {
      'name' : filesystem.name,
      'fullPath' : filesystem.fullPath,
      'nativeURL' : filesystem.nativeURL,
    };

    successCallback({'name' : filesystem.filesystemName, 'root' : root});
  }
};

//TODO: remove when added to public cordova repository -> begin
});
//TODO: remove -> end
