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

#ifndef GLOBALIZATION_CORDOVA_GLOBALIZATION_TOOLS_H_
#define GLOBALIZATION_CORDOVA_GLOBALIZATION_TOOLS_H_

#include <string>
#include <vector>
#include <memory>
#include <unicode/unistr.h>
#include <unicode/smpdtfmt.h>
#include <unicode/dtptngen.h>
#include <common/platform_result.h>


namespace extension {
namespace cordova {
namespace globalization {

extern const std::string kSelectorDateStr;
extern const std::string kSelectorTimeStr;

extern const std::string kFormatShortStr;
extern const std::string kFormatMediumStr;
extern const std::string kFormatLongStr;
extern const std::string kFormatFullStr;

extern const std::string kItemMonths;
extern const std::string kItemDays;

extern const std::string kTypeWide;
extern const std::string kTypeNarrow;

extern const std::string kNumberTypeDecimal;
extern const std::string kNumberTypePercent;
extern const std::string kNumberTypeCurrency;

class CordovaGlobalizationTools{
 public:
  static Locale GetDefaultLocale();
  static std::string ToUTF8String(const UnicodeString& uni_str);
  static std::unique_ptr<DateFormat> GetDateFormatPtr(DateFormat::EStyle format,
                                                      const std::string& selector);
  static DateFormat::EStyle GetDateFormat(const std::string& length);
  static std::string GetDateString(UDate date, DateFormat::EStyle format,
                                              const std::string& selector);
  static common::PlatformResult GetUDateFromString(const std::string& date,
                                                   DateFormat::EStyle format,
                                                   const std::string& selector,
                                                   UDate* result);
  static common::PlatformResult GetDatePattern(DateFormat::EStyle format,
                                               const std::string& selector,
                                               std::string* result);
  static common::PlatformResult GetNames(const std::string& item, const std::string& type,
                                             std::vector<std::string>* result);
  static common::PlatformResult GetFirstDayOfWeek(double* result);
  static common::PlatformResult FormatNumber(double number, const std::string& type,
                                             std::string* result);
  static common::PlatformResult ParseNumber(const std::string& number_str, const std::string& type,
                                            double* result);
  static common::PlatformResult GetNumberPattern(const std::string& type, std::string* pattern,
                                                 std::string* symbol, double* fraction,
                                                 double* rounding, std::string* positive,
                                                 std::string* negative, std::string* decimal,
                                                 std::string* grouping);
  static common::PlatformResult GetCurrencyPattern(const std::string& code, std::string* pattern,
                                                   double* fraction, double* rounding,
                                                   std::string* decimal, std::string* grouping);
};
}  // globalization
}  // cordova
}  // extension

#endif  // GLOBALIZATION_CORDOVA_GLOBALIZATION_TOOLS_H_
