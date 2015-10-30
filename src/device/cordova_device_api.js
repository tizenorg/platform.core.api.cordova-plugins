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

var _global = window || global || {};

var device = {
  cordova: cordova.version,
  model: tizen.systeminfo.getCapability('http://tizen.org/system/model_name'),
  platform: tizen.systeminfo.getCapability('http://tizen.org/system/platform.name'),
  uuid: tizen.systeminfo.getCapability('http://tizen.org/system/tizenid'),
  version: tizen.systeminfo.getCapability('http://tizen.org/feature/platform.version'),
  manufacturer: tizen.systeminfo.getCapability('http://tizen.org/system/manufacturer')  // not documented, but required by tests
};

Object.freeze(device);
Object.defineProperty(_global, 'device', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: device
});

console.log('Loaded cordova.device API');

exports = function(require) {
};
