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
cordova.define('cordova-plugin-file.tizen.DirectoryReader', function(require, exports, module) {
// TODO: remove -> end

module.exports = {
  readEntries: function(successCallback, errorCallback, args) {
    var uri = args[0];
    var fail = function(e) {
      errorCallback && errorCallback(ConvErrorCode(e.code));
    }
    try {
      tizen.filesystem.resolve(uri,
        function (v) {
          v.listFiles(function(f) {
            var retVal = [];
            for (var i = 0; i < v.length; ++i) {
              var obj = {};
              obj.isDirectory = v[i].isDirectory;
              obj.isFile = v[i].isFile;
              obj.name = v[i].name;
              obj.fullPath = v[i].fullPath;
              obj.filesystemName = rootsUtils.findFilesystem(v[i].fullPath).filesystemName;
              obj.nativeURL = v[i].toURI();
              retVal.push(obj);
            };
            successCallback(retVal);
          }, fail);
        }, fail, 'r');
    } catch (e) {
      fail(e);
    }
  }
};

//TODO: remove when added to public cordova repository -> begin
});
//TODO: remove -> end
