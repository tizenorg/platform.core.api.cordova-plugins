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

#include "media/cordova_media_extension.h"
#include "media/cordova_media_instance.h"

// This will be generated from cordova_media_api.js
extern const char kSource_cordova_media_api[];

common::Extension* CreateExtension() {
  return new extension::cordova::media::CordovaMediaExtension();
}

namespace extension {
namespace cordova {
namespace media {

CordovaMediaExtension::CordovaMediaExtension() {
  SetExtensionName("tizen.cordova.media");
  SetJavaScriptAPI(kSource_cordova_media_api);
}

CordovaMediaExtension::~CordovaMediaExtension() {}

common::Instance* CordovaMediaExtension::CreateInstance() {
  LoggerD("Entered");
  return new extension::cordova::media::CordovaMediaInstance();
}

}  // media
}  // cordova
}  // extension
