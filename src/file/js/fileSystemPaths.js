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
cordova.define('cordova-plugin-file.tizen.fileSystemPaths', function(require, exports, module) {
// TODO: remove -> end

var pathsPrefix = {
  applicationDirectory: 'wgt-package/',
  dataDirectory: 'wgt-private/',
  cacheDirectory:'wgt-private-tmp/',
  sharedDirectory: '/opt/usr/media/',
};

function setExternalStorage(successCallback, errorCallback) {
  var onSuccess = function(storages) {
    for (var i = 0; i < storages.length; i++) {
      if (storages[i].type === 'EXTERNAL' && storages[i].state === 'MOUNTED') {
        pathsPrefix.externalRootDirectory = storages[i].label + '/';
        successCallback && successCallback(pathsPrefix);
        return;
      }
    }
  }

  var onError = function(error) {
    console.error("Failed to get external storage: " + error.message);
    errorCallback && errorCallback(ConvErrorCode(error.code));
  }

  tizen.filesystem.listStorages(onSuccess, onError);
}

function setApplicationStorageDirectory(successCallback, errorCallback) {
  try {
    var app = tizen.application.getCurrentApplication();
    pathsPrefix.applicationStorageDirectory = '/opt/usr/apps/' + app.appInfo.packageId + '/';
    setExternalStorage(successCallback, errorCallback);
  } catch(error) {
    errorCallback && errorCallback(ConvErrorCode(error.code));
  }
}

module.exports = {
  requestAllPaths: function(successCallback, errorCallback, args) {
    setApplicationStorageDirectory(successCallback, errorCallback);
  }
};

//TODO: remove when added to public cordova repository -> begin
});
//TODO: remove -> end
