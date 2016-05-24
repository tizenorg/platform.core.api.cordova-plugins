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
var plugin_name = 'cordova-plugin-device.tizen.Device';

cordova.define(plugin_name, function(require, exports, module) {
// TODO: remove -> end

function DeviceInfo() {
  this.cordovaVersion = require('cordova/platform').cordovaVersion;
  this.model = tizen.systeminfo.getCapability('http://tizen.org/system/model_name');
  this.platform = tizen.systeminfo.getCapability('http://tizen.org/system/platform.name');
  this.uuid = tizen.systeminfo.getCapability('http://tizen.org/system/tizenid');
  this.version = tizen.systeminfo.getCapability('http://tizen.org/feature/platform.version');
  this.manufacturer = tizen.systeminfo.getCapability('http://tizen.org/system/manufacturer');
  this.isVirtual = -1 !== this.model.toLowerCase().indexOf('emulator');
  this.serial = this.uuid;
}

var di;

exports = {
  getDeviceInfo: function (success, error) {
    if (!di) {
      di = new DeviceInfo();
    }
    success({
      cordova: di.cordovaVersion,
      model: di.model,
      platform: di.platform,
      uuid: di.uuid,
      version: di.version,
      manufacturer: di.manufacturer,  // not documented, but required by tests
      isVirtual: di.isVirtual,
      serial: di.serial
    });
  }
};

require("cordova/exec/proxy").add("Device", exports);

console.log('Loaded cordova.device API');

// TODO: remove when added to public cordova repository -> begin
});
// TODO: remove -> end
