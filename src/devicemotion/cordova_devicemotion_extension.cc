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

#include "devicemotion/cordova_devicemotion_extension.h"

// This will be generated from cordova_devicemotion_api.js
extern const char kSource_cordova_devicemotion_api[];

common::Extension* CreateExtension() {
  return new extension::cordova::devicemotion::CordovaDevicemotionExtension();
}

namespace extension {
namespace cordova {
namespace devicemotion {

CordovaDevicemotionExtension::CordovaDevicemotionExtension() {
  SetExtensionName("tizen.cordova.devicemotion");
  SetJavaScriptAPI(kSource_cordova_devicemotion_api);
}

CordovaDevicemotionExtension::~CordovaDevicemotionExtension() {}

}  // devicemotion
}  // cordova
}  // extension
