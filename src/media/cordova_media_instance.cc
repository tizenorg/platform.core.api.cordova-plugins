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

#include "media/cordova_media_instance.h"
#include <common/logger.h>

namespace extension {
namespace cordova {
namespace media {

CordovaMediaInstance::CordovaMediaInstance(): fs_provider_(common::FilesystemProviderStorage::Create()) {
    LoggerD("Entered");

    RegisterSyncHandler("CordovaMediaInstance_GetRealPath",
        std::bind(&CordovaMediaInstance::GetRealPath, this, std::placeholders::_1, std::placeholders::_2));

}

CordovaMediaInstance::~CordovaMediaInstance() {
}

void CordovaMediaInstance::GetRealPath(const picojson::value& args, picojson::object& out) {
  LoggerD("Entered");

  const std::string& path_str =  args.get("path").get<std::string>();

  picojson::value retval = picojson::value(picojson::object());
  picojson::object& obj = retval.get<picojson::object>();

  LoggerD("Path is %s", path_str.c_str());
  std::string realPath = fs_provider_.GetRealPath(path_str);
  obj["path"] = picojson::value(realPath);
  LoggerD("Real Path is %s", realPath.c_str());
  ReportSuccess(retval,out);
}

}
}
} /* namespace media */
