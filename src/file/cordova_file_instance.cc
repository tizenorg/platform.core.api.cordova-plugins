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

#include "file/cordova_file_instance.h"

#include <unistd.h>

#include <common/logger.h>
#include <common/picojson.h>
#include <common/platform_result.h>
#include <common/tools.h>

namespace extension {
namespace cordova {
namespace file {

namespace {
const std::string kPrivilegeFilesystemWrite = "http://tizen.org/privilege/filesystem.write";
}

using common::ErrorCode;
using common::PlatformResult;

CordovaFileInstance::CordovaFileInstance() {
  using std::placeholders::_1;
  using std::placeholders::_2;

  LoggerD("Entered");

#define REGISTER_SYNC(c, x) \
        RegisterSyncHandler(c, std::bind(&CordovaFileInstance::x, this, _1, _2));
#define REGISTER_ASYNC(c, x) \
        RegisterSyncHandler(c, std::bind(&CordovaFileInstance::x, this, _1, _2));

  REGISTER_SYNC("File_truncate", Truncate);

#undef REGISTER_SYNC
#undef REGISTER_ASYNC
}

CordovaFileInstance::~CordovaFileInstance() {
  LoggerD("Entered");
}

void CordovaFileInstance::Truncate(const picojson::value& args, picojson::object& out) {
  LoggerD("Entered");

  CHECK_PRIVILEGE_ACCESS(kPrivilegeFilesystemWrite, &out);

  if (!args.contains("uri") || !args.contains("length") || !args.get("length").is<double>()) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }

  const double length = args.get("length").get<double>();
  const std::string& path = args.get("uri").get<std::string>();

  int ret = truncate(path.c_str(), length);
  LoggerD("Truncate returned value [%d]", ret);

  if (!ret) {
    ReportSuccess(out);
  } else {
    ReportError(PlatformResult(ErrorCode::UNKNOWN_ERR, "File truncate failed."), &out);
  }
}

}  // file
}  // cordova
}  // extension
