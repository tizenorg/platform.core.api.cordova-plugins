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

#ifndef GLOBALIZATION_CORDOVA_GLOBALIZATION_INSTANCE_H_
#define GLOBALIZATION_CORDOVA_GLOBALIZATION_INSTANCE_H_

#include <common/extension.h>
#include <common/picojson.h>

namespace extension {
namespace cordova {
namespace globalization {

class CordovaGlobalizationInstance : public common::ParsedInstance {
 public:
  CordovaGlobalizationInstance();
  virtual ~CordovaGlobalizationInstance();

 private:
  void DateToString(const picojson::value& args, picojson::object& out);
  void StringToDate(const picojson::value& args, picojson::object& out);
  void GetDatePattern(const picojson::value& args, picojson::object& out);
  void GetDateNames(const picojson::value& args, picojson::object& out);
  void GetFirstDayOfWeek(const picojson::value& args, picojson::object& out);
  void NumberToString(const picojson::value& args, picojson::object& out);
  void StringToNumber(const picojson::value& args, picojson::object& out);
  void GetNumberPattern(const picojson::value& args, picojson::object& out);
  void GetCurrencyPattern(const picojson::value& args, picojson::object& out);
};
}  // globalization
}  // cordova
}  // extension

#endif  // GLOBALIZATION_CORDOVA_GLOBALIZATION_INSTANCE_H_
