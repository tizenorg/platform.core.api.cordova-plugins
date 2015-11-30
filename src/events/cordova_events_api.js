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
var plugin_name = 'cordova-plugin-events.tizen.Events';

cordova.define(plugin_name, function(require, exports, module) {
// TODO: remove -> end

exports = {
  startListener: function(successCallback, errorCallback, args) {
    var e = args[0];
  },
  stopListener: function(successCallback, errorCallback, args) {
    var e = args[0];
  }
};

require('cordova/exec/proxy').add('Events', exports);

console.log('Loaded cordova.events API');

// TODO: remove when added to public cordova repository -> begin
});

exports = function(require) {
  require('cordova-tizen').addPlugin('cordova-plugin-events.register', plugin_name, 'runs');
};
// TODO: remove -> end
