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
var plugin_name = 'cordova-plugin-media.tizen.Media';

cordova.define(plugin_name, function(require, exports, module) {
// TODO: remove -> end

  exports = {
  create: function(successCallback, errorCallback, args) {
    console.log("Media create stub");
  },
  startPlayingAudio: function(successCallback, errorCallback, args) {},
  stopPlayingAudio: function(successCallback, errorCallback, args) {},
  seekToAudio: function(successCallback, errorCallback, args) {},
  pausePlayingAudio: function(successCallback, errorCallback, args) {},
  getCurrentPositionAudio: function(successCallback, errorCallback, args) {},
  startRecordingAudio: function(successCallback, errorCallback, args) {},
  stopRecordingAudio: function(successCallback, errorCallback, args) {},
  release: function(successCallback, errorCallback, args) {},
  setVolume: function(successCallback, errorCallback, args) {},
  setRate: function(successCallback, errorCallback, args) {},
  messageChannel: function(successCallback, errorCallback, args) {}
};
require("cordova/exec/proxy").add("Media", exports);

console.log('Loaded cordova.media API');

// TODO: remove when added to public cordova repository -> begin
});

exports = function(require) {
  require('cordova-tizen').addPlugin('cordova-plugin-media.Media', plugin_name, 'runs');
};
// TODO: remove -> end
