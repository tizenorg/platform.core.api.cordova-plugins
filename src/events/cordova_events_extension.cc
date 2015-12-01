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

#include "events/cordova_events_extension.h"

// This will be generated from cordova_events_api.js
extern const char kSource_cordova_events_api[];

common::Extension* CreateExtension() {
  return new extension::cordova::events::CordovaEventsExtension();
}

namespace extension {
namespace cordova {
namespace events {

CordovaEventsExtension::CordovaEventsExtension() {
  SetExtensionName("tizen.cordova.events");
  SetJavaScriptAPI(kSource_cordova_events_api);
}

CordovaEventsExtension::~CordovaEventsExtension() {}

}  // events
}  // cordova
}  // extension
