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
var plugin_name = 'cordova-plugin-file.tizen.File';

cordova.define(plugin_name, function(require, exports, module) {
// TODO: remove -> end

var pathsPrefix = {
  // TODO: add other directories
  // Read-only directory where the application is installed.
  applicationDirectory: 'wgt-package/'
};

exports.requestAllPaths = function(successCallback) {
  successCallback(pathsPrefix);
};

require("cordova/exec/proxy").add("File", exports);

console.log('Loaded cordova.file API');

// TODO: remove when added to public cordova repository -> begin
});

exports = function(require) {
  // this plugin is not loaded via cordova_plugins.js, we need to manually add
  // it to module mapper
  var mm = require('cordova/modulemapper');
  mm.runs(plugin_name);
};
//TODO: remove -> end
