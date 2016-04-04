/*
 * Copyright (c) 2016 Samsung Electronics Co., Ltd All Rights Reserved
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

#include "dialog/cordova_dialog_instance.h"
#include <common/logger.h>
#include <common/picojson.h>
#include <common/platform_result.h>

namespace extension {
namespace cordova {
namespace dialog {

CordovaDialogInstance::CordovaDialogInstance() {
  using std::placeholders::_1;
  using std::placeholders::_2;

  LoggerD("Entered");

#define REGISTER_SYNC(c, x) \
        RegisterSyncHandler(c, std::bind(&CordovaDialogInstance::x, this, _1, _2));

  REGISTER_SYNC("CordovaDialog_getProfile", GetProfile);

#undef REGISTER_SYNC
}

CordovaDialogInstance::~CordovaDialogInstance() {
  LoggerD("Entered");
}

void CordovaDialogInstance::GetProfile(const picojson::value& args,
                                    picojson::object& out) {
  LoggerD("Entered");
  std::string profile = "MobileOrWearable";
#ifdef TIZEN_TV
  profile = "TV";
#endif
  picojson::value result = picojson::value(picojson::object());
  picojson::object& result_obj = result.get<picojson::object>();
  result_obj.insert(std::make_pair("profile", picojson::value(profile)));

  ReportSuccess(result, out);
}

}  // dialog
}  // cordova
}  // extension
