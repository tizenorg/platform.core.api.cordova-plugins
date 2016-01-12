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

#include "globalization/cordova_globalization_instance.h"
#include <stdlib.h>
#include <algorithm>
#include <memory>
#include <sstream>
#include <common/logger.h>
#include <common/picojson.h>
#include <common/platform_result.h>
#include <common/task-queue.h>
#include "globalization/cordova_globalization_tools.h"

namespace extension {
namespace cordova {
namespace globalization {

using std::string;
using common::ErrorCode;
using common::PlatformResult;
using common::Instance;
using common::TaskQueue;

CordovaGlobalizationInstance::CordovaGlobalizationInstance() {
  using std::placeholders::_1;
  using std::placeholders::_2;

  LoggerD("Entered");

#define REGISTER_SYNC(c, x) \
        RegisterSyncHandler(c, std::bind(&CordovaGlobalizationInstance::x, this, _1, _2));
#define REGISTER_ASYNC(c, x) \
        RegisterSyncHandler(c, std::bind(&CordovaGlobalizationInstance::x, this, _1, _2));

  REGISTER_SYNC("CordovaGlobalization_dateToString", DateToString);
  REGISTER_SYNC("CordovaGlobalization_stringToDate", StringToDate);
  REGISTER_SYNC("CordovaGlobalization_getDatePattern", GetDatePattern);
  REGISTER_SYNC("CordovaGlobalization_getDateNames", GetDateNames);
  REGISTER_SYNC("CordovaGlobalization_getFirstDayOfWeek", GetFirstDayOfWeek);
  REGISTER_SYNC("CordovaGlobalization_numberToString", NumberToString);
  REGISTER_SYNC("CordovaGlobalization_stringToNumber", StringToNumber);
  REGISTER_SYNC("CordovaGlobalization_getNumberPattern", GetNumberPattern);
  REGISTER_SYNC("CordovaGlobalization_getCurrencyPattern", GetCurrencyPattern);


#undef REGISTER_SYNC
#undef REGISTER_ASYNC
}

CordovaGlobalizationInstance::~CordovaGlobalizationInstance() {
  LoggerD("Entered");
}

void CordovaGlobalizationInstance::DateToString(const picojson::value& args,
                                                  picojson::object& out) {
  LoggerD("Entered");
  if (!args.contains("formatLength") || !args.contains("selector") || !args.contains("timestamp") ||
      !args.contains("callbackId")) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }
  const double callback_id = args.get("callbackId").get<double>();

  const std::string& format_length = args.get("formatLength").get<std::string>();
  const std::string& selector = args.get("selector").get<std::string>();
  const std::string& timestamp_str = args.get("timestamp").get<std::string>();
  UDate date = std::stod(timestamp_str);

  auto get = [this, format_length, selector, date, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    string result_str = CordovaGlobalizationTools::GetDateString(
        date, CordovaGlobalizationTools::GetDateFormat(format_length), selector);

    picojson::value result = picojson::value(picojson::object());
    picojson::object& result_obj = result.get<picojson::object>();
    result_obj.insert(std::make_pair("value", picojson::value(result_str)));
    ReportSuccess(result, response->get<picojson::object>());
  };

  auto get_response = [this, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    LoggerD("Getting response");
    picojson::object& obj = response->get<picojson::object>();
    obj.insert(std::make_pair("callbackId", picojson::value{static_cast<double>(callback_id)}));
    LoggerD("message: %s", response->serialize().c_str());
    Instance::PostMessage(this, response->serialize().c_str());
  };

  auto data = std::shared_ptr<picojson::value>(new picojson::value(picojson::object()));
  TaskQueue::GetInstance().Queue<picojson::value>(get, get_response, data);
}

void CordovaGlobalizationInstance::StringToDate(const picojson::value& args,
                                                  picojson::object& out) {
  LoggerD("Entered");
  if (!args.contains("formatLength") || !args.contains("selector") || !args.contains("dateString") ||
      !args.contains("callbackId")) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }
  const double callback_id = args.get("callbackId").get<double>();

  const std::string& format_length = args.get("formatLength").get<std::string>();
  const std::string& selector = args.get("selector").get<std::string>();
  const std::string& date_str = args.get("dateString").get<std::string>();

  auto get = [this, format_length, selector, date_str](const std::shared_ptr<picojson::value>& response) -> void {
    UDate result_date = 0;
    PlatformResult ret = CordovaGlobalizationTools::GetUDateFromString(
        date_str, CordovaGlobalizationTools::GetDateFormat(format_length), selector, &result_date);

    if (ret.IsSuccess()) {
      // UDate holds milliseconds, conversion to time_t needs seconds
      time_t seconds_ts = (time_t)(result_date / 1000);

      struct tm * result_time = localtime(&seconds_ts);
      picojson::value result = picojson::value(picojson::object());
      picojson::object& result_obj = result.get<picojson::object>();
      result_obj.insert(std::make_pair(
          "year", picojson::value(static_cast<double>(result_time->tm_year + 1900))));
      result_obj.insert(std::make_pair(
          "month", picojson::value(static_cast<double>(result_time->tm_mon))));
      result_obj.insert(std::make_pair(
          "day", picojson::value(static_cast<double>(result_time->tm_mday))));
      result_obj.insert(std::make_pair(
          "hour", picojson::value(static_cast<double>(result_time->tm_hour))));
      result_obj.insert(std::make_pair(
          "minute", picojson::value(static_cast<double>(result_time->tm_min))));
      result_obj.insert(std::make_pair(
          "second", picojson::value(static_cast<double>(result_time->tm_sec))));
      result_obj.insert(std::make_pair(
          "millisecond", picojson::value(static_cast<double>(0.0))));

      ReportSuccess(result, response->get<picojson::object>());
    } else {
      ReportError(ret, &(response->get<picojson::object>()));
    }
  };

  auto get_response = [this, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    LoggerD("Getting response");
    picojson::object& obj = response->get<picojson::object>();
    obj.insert(std::make_pair("callbackId", picojson::value{static_cast<double>(callback_id)}));
    LoggerD("message: %s", response->serialize().c_str());
    Instance::PostMessage(this, response->serialize().c_str());
  };

  auto data = std::shared_ptr<picojson::value>(new picojson::value(picojson::object()));
  TaskQueue::GetInstance().Queue<picojson::value>(get, get_response, data);
}

void CordovaGlobalizationInstance::GetDatePattern(const picojson::value& args,
                                                  picojson::object& out) {
  LoggerD("Entered");
  if (!args.contains("formatLength") || !args.contains("selector") || !args.contains("callbackId")) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }
  const double callback_id = args.get("callbackId").get<double>();

  const std::string& format_length = args.get("formatLength").get<std::string>();
  const std::string& selector = args.get("selector").get<std::string>();

  auto get = [this, format_length, selector](const std::shared_ptr<picojson::value>& response) -> void {
    string result_str;
    PlatformResult ret = CordovaGlobalizationTools::GetDatePattern(
        CordovaGlobalizationTools::GetDateFormat(format_length), selector, &result_str);

    if (ret.IsSuccess()) {
      picojson::value result = picojson::value(picojson::object());
      picojson::object& result_obj = result.get<picojson::object>();

      result_obj.insert(std::make_pair("pattern", picojson::value(result_str)));

      std::string result_str;
      ret = CordovaGlobalizationTools::GetTimezoneAbbreviation(&result_str);
      if (ret.IsSuccess()) {
        result_obj.insert(std::make_pair("timezone", picojson::value(result_str)));
        ReportSuccess(result, response->get<picojson::object>());
      } else {
        ReportError(ret, &(response->get<picojson::object>()));
      }
    } else {
      ReportError(ret, &(response->get<picojson::object>()));
    }
  };

  auto get_response = [this, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    LoggerD("Getting response");
    picojson::object& obj = response->get<picojson::object>();
    obj.insert(std::make_pair("callbackId", picojson::value{static_cast<double>(callback_id)}));
    LoggerD("message: %s", response->serialize().c_str());
    Instance::PostMessage(this, response->serialize().c_str());
  };

  auto data = std::shared_ptr<picojson::value>(new picojson::value(picojson::object()));
  TaskQueue::GetInstance().Queue<picojson::value>(get, get_response, data);
}

void CordovaGlobalizationInstance::GetDateNames(const picojson::value& args,
                                                  picojson::object& out) {
  LoggerD("Entered");
  if (!args.contains("type") || !args.contains("item") || !args.contains("callbackId")) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }
  const double callback_id = args.get("callbackId").get<double>();

  const std::string& type = args.get("type").get<std::string>();
  const std::string& item = args.get("item").get<std::string>();

  auto get = [this, type, item](const std::shared_ptr<picojson::value>& response) -> void {
    std::vector<std::string> items;
    PlatformResult ret = CordovaGlobalizationTools::GetNames(item, type, &items);

    if (ret.IsError() || items.empty()) {
      LoggerE("Cannot get names for %s", item.c_str());
      ReportError(PlatformResult(ErrorCode::UNKNOWN_ERR, "Cannot get names."),
                  &(response->get<picojson::object>()));
    }

    // creating json array
    picojson::value result_array = picojson::value(picojson::array());
    picojson::array& array_obj = result_array.get<picojson::array>();
    for (size_t i = 0 ; i < items.size(); i++) {
      array_obj.push_back(picojson::value(items[i]));
    }

    picojson::value result = picojson::value(picojson::object());
    picojson::object& result_obj = result.get<picojson::object>();
    result_obj.insert(std::make_pair("value", result_array));
    ReportSuccess(result, response->get<picojson::object>());
  };

  auto get_response = [this, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    LoggerD("Getting response");
    picojson::object& obj = response->get<picojson::object>();
    obj.insert(std::make_pair("callbackId", picojson::value{static_cast<double>(callback_id)}));
    LoggerD("message: %s", response->serialize().c_str());
    Instance::PostMessage(this, response->serialize().c_str());
  };

  auto data = std::shared_ptr<picojson::value>(new picojson::value(picojson::object()));
  TaskQueue::GetInstance().Queue<picojson::value>(get, get_response, data);
}

void CordovaGlobalizationInstance::GetFirstDayOfWeek(const picojson::value& args,
                                                  picojson::object& out) {
  LoggerD("Entered");
  if (!args.contains("callbackId")) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }
  const double callback_id = args.get("callbackId").get<double>();

  auto get = [this](const std::shared_ptr<picojson::value>& response) -> void {
    double first_day_value = 0;
    PlatformResult ret = CordovaGlobalizationTools::GetFirstDayOfWeek(&first_day_value);
    if (ret.IsSuccess()) {
      picojson::value result = picojson::value(picojson::object());
      picojson::object& result_obj = result.get<picojson::object>();
      result_obj.insert(std::make_pair("value", picojson::value(first_day_value)));
      ReportSuccess(result, response->get<picojson::object>());
    } else {
      ReportError(ret, &(response->get<picojson::object>()));
    }
  };

  auto get_response = [this, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    LoggerD("Getting response");
    picojson::object& obj = response->get<picojson::object>();
    obj.insert(std::make_pair("callbackId", picojson::value{static_cast<double>(callback_id)}));
    LoggerD("message: %s", response->serialize().c_str());
    Instance::PostMessage(this, response->serialize().c_str());
  };

  auto data = std::shared_ptr<picojson::value>(new picojson::value(picojson::object()));
  TaskQueue::GetInstance().Queue<picojson::value>(get, get_response, data);
}

void CordovaGlobalizationInstance::NumberToString(const picojson::value& args,
                                                  picojson::object& out) {
  LoggerD("Entered");
  if (!args.contains("type") || !args.contains("number") || !args.contains("callbackId")) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }
  const double callback_id = args.get("callbackId").get<double>();

  // this type of conversion of double is locale independent, always parse dots (JS send number with dot)
  double number = 0.0f;
  std::istringstream istr(args.get("number").get<std::string>());
  istr >> number;

  const std::string& type = args.get("type").get<std::string>();

  auto get = [this, type, number](const std::shared_ptr<picojson::value>& response) -> void {
    std::string result_str;
    PlatformResult ret = CordovaGlobalizationTools::FormatNumber(number, type, &result_str);
    if (ret.IsSuccess()) {
      picojson::value result = picojson::value(picojson::object());
      picojson::object& result_obj = result.get<picojson::object>();
      result_obj.insert(std::make_pair("value", picojson::value(result_str)));
      ReportSuccess(result, response->get<picojson::object>());
    } else {
      ReportError(ret, &(response->get<picojson::object>()));
    }
  };

  auto get_response = [this, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    LoggerD("Getting response");
    picojson::object& obj = response->get<picojson::object>();
    obj.insert(std::make_pair("callbackId", picojson::value{static_cast<double>(callback_id)}));
    LoggerD("message: %s", response->serialize().c_str());
    Instance::PostMessage(this, response->serialize().c_str());
  };

  auto data = std::shared_ptr<picojson::value>(new picojson::value(picojson::object()));
  TaskQueue::GetInstance().Queue<picojson::value>(get, get_response, data);
}

void CordovaGlobalizationInstance::StringToNumber(const picojson::value& args,
                                                  picojson::object& out) {
  LoggerD("Entered");
  if (!args.contains("type") || !args.contains("number") || !args.contains("callbackId")) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }
  const double callback_id = args.get("callbackId").get<double>();
  const std::string& number_str =  args.get("number").get<std::string>();
  const std::string& type = args.get("type").get<std::string>();

  auto get = [this, type, number_str](const std::shared_ptr<picojson::value>& response) -> void {
    double result_num = 0;
    PlatformResult ret = CordovaGlobalizationTools::ParseNumber(number_str, type, &result_num);

    if (ret.IsSuccess()) {
      // replacing ',' for '.' if any exist, locale independence (JS need number with dot)
      std::string result_str = std::to_string(result_num);
      std::replace(result_str.begin(), result_str.end(), ',', '.');

      picojson::value result = picojson::value(picojson::object());
      picojson::object& result_obj = result.get<picojson::object>();
      result_obj.insert(std::make_pair("value", picojson::value(result_str)));
      ReportSuccess(result, response->get<picojson::object>());
    } else {
      ReportError(ret, &(response->get<picojson::object>()));
    }
  };

  auto get_response = [this, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    LoggerD("Getting response");
    picojson::object& obj = response->get<picojson::object>();
    obj.insert(std::make_pair("callbackId", picojson::value{static_cast<double>(callback_id)}));
    LoggerD("message: %s", response->serialize().c_str());
    Instance::PostMessage(this, response->serialize().c_str());
  };

  auto data = std::shared_ptr<picojson::value>(new picojson::value(picojson::object()));
  TaskQueue::GetInstance().Queue<picojson::value>(get, get_response, data);
}

void CordovaGlobalizationInstance::GetNumberPattern(const picojson::value& args,
                                                  picojson::object& out) {
  LoggerD("Entered");
  if (!args.contains("type") || !args.contains("callbackId")) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }
  const double callback_id = args.get("callbackId").get<double>();
  const std::string& type = args.get("type").get<std::string>();

  auto get = [this, type](const std::shared_ptr<picojson::value>& response) -> void {
    picojson::value result = picojson::value(picojson::object());
    picojson::object& result_obj = result.get<picojson::object>();

    std::string res_pattern, res_symbol, res_positive, res_negative, res_decimal, res_grouping;
    double res_fraction = 0;
    double res_rounding = 0;

    CordovaGlobalizationTools::GetNumberPattern(type, &res_pattern, &res_symbol, &res_fraction,
                                                &res_rounding, &res_positive, &res_negative,
                                                &res_decimal, &res_grouping);
    result_obj.insert(std::make_pair("pattern", picojson::value(res_pattern)));
    result_obj.insert(std::make_pair("symbol", picojson::value(res_symbol)));
    result_obj.insert(std::make_pair("fraction", picojson::value(res_fraction)));
    result_obj.insert(std::make_pair("rounding", picojson::value(res_rounding)));
    result_obj.insert(std::make_pair("positive", picojson::value(res_positive)));
    result_obj.insert(std::make_pair("negative", picojson::value(res_negative)));
    result_obj.insert(std::make_pair("decimal", picojson::value(res_decimal)));
    result_obj.insert(std::make_pair("grouping", picojson::value(res_grouping)));

    ReportSuccess(result, response->get<picojson::object>());
  };

  auto get_response = [this, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    LoggerD("Getting response");
    picojson::object& obj = response->get<picojson::object>();
    obj.insert(std::make_pair("callbackId", picojson::value{static_cast<double>(callback_id)}));
    LoggerD("message: %s", response->serialize().c_str());
    Instance::PostMessage(this, response->serialize().c_str());
  };

  auto data = std::shared_ptr<picojson::value>(new picojson::value(picojson::object()));
  TaskQueue::GetInstance().Queue<picojson::value>(get, get_response, data);
}

void CordovaGlobalizationInstance::GetCurrencyPattern(const picojson::value& args,
                                                  picojson::object& out) {
  LoggerD("Entered");
  if (!args.contains("currencyCode") || !args.contains("callbackId")) {
    LoggerE("Invalid parameter passed.");
    ReportError(PlatformResult(ErrorCode::INVALID_VALUES_ERR, "Invalid parameter passed."), &out);
    return;
  }
  const double callback_id = args.get("callbackId").get<double>();
  const std::string& code = args.get("currencyCode").get<std::string>();

  auto get = [this, code](const std::shared_ptr<picojson::value>& response) -> void {
    picojson::value result = picojson::value(picojson::object());
    picojson::object& result_obj = result.get<picojson::object>();

    std::string res_pattern, res_decimal, res_grouping;
    double res_fraction = 0;
    double res_rounding = 0;

    CordovaGlobalizationTools::GetCurrencyPattern(code, &res_pattern, &res_fraction,
                                                &res_rounding, &res_decimal, &res_grouping);
    result_obj.insert(std::make_pair("pattern", picojson::value(res_pattern)));
    result_obj.insert(std::make_pair("code", picojson::value(code)));
    result_obj.insert(std::make_pair("fraction", picojson::value(res_fraction)));
    result_obj.insert(std::make_pair("rounding", picojson::value(res_rounding)));
    result_obj.insert(std::make_pair("decimal", picojson::value(res_decimal)));
    result_obj.insert(std::make_pair("grouping", picojson::value(res_grouping)));

    ReportSuccess(result, response->get<picojson::object>());
  };

  auto get_response = [this, callback_id](const std::shared_ptr<picojson::value>& response) -> void {
    LoggerD("Getting response");
    picojson::object& obj = response->get<picojson::object>();
    obj.insert(std::make_pair("callbackId", picojson::value{static_cast<double>(callback_id)}));
    LoggerD("message: %s", response->serialize().c_str());
    Instance::PostMessage(this, response->serialize().c_str());
  };

  auto data = std::shared_ptr<picojson::value>(new picojson::value(picojson::object()));
  TaskQueue::GetInstance().Queue<picojson::value>(get, get_response, data);
}

}  // globalization
}  // cordova
}  // extension
