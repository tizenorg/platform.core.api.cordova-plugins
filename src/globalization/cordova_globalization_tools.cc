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

#include "globalization/cordova_globalization_tools.h"
#include <memory>
#include <vconf.h>
#include <unicode/dtfmtsym.h>
#include <unicode/decimfmt.h>
#include <common/logger.h>

namespace extension {
namespace cordova {
namespace globalization {

using std::string;
using common::ErrorCode;
using common::PlatformResult;

const std::string kSelectorDateStr = "date";
const std::string kSelectorTimeStr = "time";

const std::string kFormatShortStr = "short";
const std::string kFormatMediumStr = "medium";
const std::string kFormatLongStr = "long";
const std::string kFormatFullStr = "full";

const std::string kItemMonths = "months";
const std::string kItemDays = "days";

const std::string kTypeWide = "wide";
const std::string kTypeNarrow = "narrow";

const std::string kNumberTypeDecimal = "decimal";
const std::string kNumberTypePercent = "percent";
const std::string kNumberTypeCurrency = "currency";

Locale CordovaGlobalizationTools::GetDefaultLocale() {
  LoggerD("Entered");
  char* tempstr = vconf_get_str(VCONFKEY_REGIONFORMAT);

  if (nullptr != tempstr){
    LoggerD("Region: %s", tempstr);

    char* p = strchr(tempstr, '.');
    int len = strlen(tempstr) - (p != nullptr ? strlen(p) : 0);

    if (len > 0) {
      char* str_region = strndup(tempstr, len); //.UTF8 => 5
      free(tempstr);
      Locale result = Locale::createFromName(str_region);
      free(str_region);
      return result;
    }
  }

  return Locale::createFromName("en_US");
}

std::string CordovaGlobalizationTools::ToUTF8String(const UnicodeString& uni_str) {
  LoggerD("Entered");
  int buffer_len = sizeof(UChar) * uni_str.length() + 1;
  std::unique_ptr<char, void(*)(void*)> result_buffer(static_cast<char*>(malloc(buffer_len)),
                                                      &std::free);
  if (!result_buffer) {
    return "";
  }

  memset(result_buffer.get(), 0, buffer_len);
  CheckedArrayByteSink sink(result_buffer.get(), buffer_len);
  uni_str.toUTF8(sink);

  if (sink.Overflowed()) {
    return "";
  }

  return result_buffer.get();
}

DateFormat::EStyle CordovaGlobalizationTools::GetDateFormat(const std::string& length) {
  LoggerD("Entered");
  if (kFormatShortStr == length) {
    return DateFormat::kShort;
  } else if (kFormatMediumStr == length) {
    return DateFormat::kMedium;
  } else if (kFormatLongStr == length) {
    return DateFormat::kLong;
  }
  // default length would be full
  return DateFormat::kFull;
}

std::unique_ptr<DateFormat> CordovaGlobalizationTools::GetDateFormatPtr(DateFormat::EStyle format,
                                                                        const std::string& selector) {
  LoggerD("Entered");
  bool foundDate = (std::string::npos != selector.find(kSelectorDateStr));
  bool foundTime = (std::string::npos != selector.find(kSelectorTimeStr));

  std::unique_ptr<DateFormat> dfmt;
  Locale l = GetDefaultLocale();
  if (foundDate && !foundTime) {
    dfmt.reset(DateFormat::createDateInstance(format, l));
  } else if (!foundDate && foundTime) {
    dfmt.reset(DateFormat::createTimeInstance(format, l));
  } else {
    dfmt.reset(DateFormat::createDateTimeInstance(format, format, l));
  }
  return dfmt;
}

std::string CordovaGlobalizationTools::GetDateString(UDate date, DateFormat::EStyle format,
                                                     const std::string& selector) {
  LoggerD("Entered");
  UnicodeString str;
  std::unique_ptr<DateFormat> dfmt = GetDateFormatPtr(format, selector);

  dfmt->format(date, str);
  return ToUTF8String(str);
}

PlatformResult CordovaGlobalizationTools::GetUDateFromString(const std::string& date,
                                                             DateFormat::EStyle format,
                                                             const std::string& selector,
                                                             UDate* result) {
  LoggerD("Entered");
  UErrorCode ec = U_ZERO_ERROR;
  std::unique_ptr<DateFormat> dfmt = GetDateFormatPtr(format, selector);

  UDate tmp_result = dfmt->parse(UnicodeString(date.c_str()), ec);
  if (U_ZERO_ERROR >= ec) {
    *result = tmp_result;
    return PlatformResult(ErrorCode::NO_ERROR);
  } else {
    return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not parse date");
  }
}

PlatformResult CordovaGlobalizationTools::GetDatePattern(DateFormat::EStyle format,
                                                      const std::string& selector, std::string* result) {
  LoggerD("Entered");
  UErrorCode ec = U_ZERO_ERROR;
  UnicodeString res;
  std::unique_ptr<DateFormat> dfmt = GetDateFormatPtr(format, selector);

  if (SimpleDateFormat::getStaticClassID() != dfmt->getDynamicClassID()) {
    LoggerE("Could not cast to SimpleDateFormat, operation failed");
    return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not cast to SimpleDateFormat");
  } else {
    LoggerE("Casting to SimpleDateFormat is allowed");
  }

  SimpleDateFormat* sdf = dynamic_cast<SimpleDateFormat*>(dfmt.get());
  if (sdf) {
    std::string tmp_result = ToUTF8String(sdf->toLocalizedPattern(res, ec));
    if (U_ZERO_ERROR >= ec) {
      *result = tmp_result;
      return PlatformResult(ErrorCode::NO_ERROR);
    }
  }
  return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not get date pattern");
}


PlatformResult CordovaGlobalizationTools::GetTimezoneAbbreviation(std::string *result_string) {
  LoggerD("Entered");
  UErrorCode uec = U_ZERO_ERROR;
  UnicodeString str;
  PlatformResult pr(ErrorCode::NO_ERROR);
  std::unique_ptr<DateFormat> fmt(
      new SimpleDateFormat(UnicodeString("z"), Locale::getEnglish(), uec));
  if (U_SUCCESS(uec)) {
    std::unique_ptr<TimeZone> tz(TimeZone::createDefault());
    fmt->setTimeZone(*tz);
    fmt->format(0L, str);
    if ((str.length() > 3) && (str.compare(0, 3, "GMT") == 0)) {
      LoggerD("Returned time zone is a GMT offset.");
      str.remove();
      std::unique_ptr<DateFormat> gmt(
          new SimpleDateFormat(UnicodeString("OOOO"), Locale::getEnglish(), uec));
      gmt->setTimeZone(*tz);
      gmt->format(0L, str);
    } else {
      LoggerD("Returned time zone is not a GMT offset.");
    }

    *result_string = ToUTF8String(str);
  } else {
    LoggerE("Error: could not obtain the time zone.");
    *result_string = "";
    pr = PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not obtain the time zone.");
  }

  return pr;
}

PlatformResult CordovaGlobalizationTools::GetNames(const std::string& item,
                                                   const std::string& type,
                                                   std::vector<std::string>* result) {
  LoggerD("Entered");
  std::vector<std::string> tmp_result;
  int32_t count = 0;
  UErrorCode ec = U_ZERO_ERROR;
  icu::DateFormatSymbols dfs = DateFormatSymbols(GetDefaultLocale(), ec);
  if (U_ZERO_ERROR >= ec) {
    UnicodeString* names_vector = nullptr; // DateFormatSymbols retains ownership.
    if (kItemMonths == item) {
      if (kTypeWide == type) {
        names_vector = const_cast<UnicodeString*>(dfs.getMonths(count));
      } else {
        names_vector = const_cast<UnicodeString*>(dfs.getShortMonths(count));
      }
    } else {
      if (kTypeWide == type) {
        names_vector = const_cast<UnicodeString*>(dfs.getWeekdays(count));
      } else {
        names_vector = const_cast<UnicodeString*>(dfs.getShortWeekdays(count));
      }
    }

    if (names_vector) {
      for (int i = 0; i < count;++i) {
        if (names_vector[i].length() > 0) {
          tmp_result.push_back(ToUTF8String(names_vector[i]));
        }
      }
    }
    *result = tmp_result;
    return PlatformResult(ErrorCode::NO_ERROR);
  } else {
    return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not get names");
  }
}

PlatformResult CordovaGlobalizationTools::GetFirstDayOfWeek(double* result) {
  LoggerD("Entered");
  UErrorCode ec = U_ZERO_ERROR;
  std::unique_ptr<DateFormat> dfmt(DateFormat::createDateInstance(DateFormat::kFull,
                                                                  GetDefaultLocale()));

  UCalendarDaysOfWeek first_day = dfmt->getCalendar()->getFirstDayOfWeek(ec);
  if (U_ZERO_ERROR >= ec) {
    *result = static_cast<double>(first_day);
    return PlatformResult(ErrorCode::NO_ERROR);
  } else {
    return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not get day first of week");
  }
}

PlatformResult CordovaGlobalizationTools::FormatNumber(double number, const std::string& type,
                                                       std::string* result) {
  LoggerD("Entered");
  UErrorCode ec = U_ZERO_ERROR;
  UnicodeString str;
  Locale l = GetDefaultLocale();

  std::unique_ptr<NumberFormat> nfmt;
  if (kNumberTypeCurrency == type) {
    nfmt.reset(NumberFormat::createCurrencyInstance(l, ec));
  } else if (kNumberTypePercent == type) {
    nfmt.reset(NumberFormat::createPercentInstance(l, ec));
  } else {
    nfmt.reset(NumberFormat::createInstance(l, ec));
  }
  if (U_ZERO_ERROR >= ec) {
    nfmt->format(number, str);
    *result = ToUTF8String(str);
    return PlatformResult(ErrorCode::NO_ERROR);
  } else {
    return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not format number");
  }
}

PlatformResult CordovaGlobalizationTools::ParseNumber(const std::string& number_str,
                                                      const std::string& type,
                                                      double* result) {
  LoggerD("Entered");
  UErrorCode ec = U_ZERO_ERROR;
  Locale l = GetDefaultLocale();
  UnicodeString str(number_str.c_str());
  PlatformResult res(ErrorCode::NO_ERROR);

  std::unique_ptr<NumberFormat> nfmt;
  if (kNumberTypeCurrency == type) {
    nfmt.reset(NumberFormat::createCurrencyInstance(l, ec));
    if (U_ZERO_ERROR >= ec) {
      ParsePosition ppos;
      std::unique_ptr<CurrencyAmount> ca(nfmt->parseCurrency(str, ppos));
      // always use functions with error check
      if (!ca) {
        LoggerE("parseCurrency failed");
        res = PlatformResult(ErrorCode::UNKNOWN_ERR, "parseCurrency failed");
      } else {
        *result = ca->getNumber().getDouble(ec);
        if (U_ZERO_ERROR < ec) {
          res = PlatformResult(ErrorCode::UNKNOWN_ERR, "getting double value failed");
        }
      }
    } else {
      res = PlatformResult(ErrorCode::UNKNOWN_ERR, "could not create currency parser");
    }
    return res;
  } else if (kNumberTypePercent == type) {
    nfmt.reset(NumberFormat::createPercentInstance(l, ec));
  } else {
    nfmt.reset(NumberFormat::createInstance(l, ec));
  }
  if (U_ZERO_ERROR < ec) {
    LoggerD("could not create number parser: %d", ec);
    res = PlatformResult(ErrorCode::UNKNOWN_ERR, "could not create number parser");
  } else {
    Formattable formatable;
    nfmt->parse(str, formatable, ec);
    if (U_ZERO_ERROR >= ec) {
      *result = formatable.getDouble(ec);
      if (U_ZERO_ERROR < ec) {
        res = PlatformResult(ErrorCode::UNKNOWN_ERR, "getting double value failed");
      }
    } else {
      res = PlatformResult(ErrorCode::UNKNOWN_ERR, "parsing failed");
    }
  }
  return res;
}

PlatformResult CordovaGlobalizationTools::GetNumberPattern(const std::string& type, std::string* pattern,
                                                        std::string* symbol, double* fraction,
                                                        double* rounding, std::string* positive,
                                                        std::string* negative, std::string* decimal,
                                                        std::string* grouping) {
  LoggerD("Entered");
  UErrorCode ec = U_ZERO_ERROR;
  UnicodeString res;
  Locale l = GetDefaultLocale();

  std::unique_ptr<NumberFormat> nfmt;
  icu::DecimalFormatSymbols dfs = DecimalFormatSymbols(l, ec);
  if (kNumberTypeCurrency == type) {
    nfmt.reset(NumberFormat::createCurrencyInstance(l, ec));
    *symbol = ToUTF8String(dfs.getSymbol(DecimalFormatSymbols::kCurrencySymbol));
  } else if (kNumberTypePercent == type) {
    nfmt.reset(NumberFormat::createPercentInstance(l, ec));
    *symbol = ToUTF8String(dfs.getSymbol(DecimalFormatSymbols::kPercentSymbol));
  } else {
    nfmt.reset(NumberFormat::createInstance(l, ec));
    *symbol = ToUTF8String(dfs.getSymbol(DecimalFormatSymbols::kDecimalSeparatorSymbol));
  }
  if (U_ZERO_ERROR >= ec) {
    if (DecimalFormat::getStaticClassID() != nfmt->getDynamicClassID()) {
      LoggerE("Could not cast to DecimalFormat, operation failed");
      return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not cast to DecimalFormat");
    } else {
      LoggerE("Casting to DecimalFormat is allowed");
    }
    DecimalFormat* df = dynamic_cast<DecimalFormat*>(nfmt.get());
    if (!df) {
      LoggerE("Casting failed");
      *pattern = "error";
      *fraction = -1.0;
      *rounding = -1.0;
    } else {
      *pattern = ToUTF8String(df->toLocalizedPattern(res));
      *fraction = df->getMaximumFractionDigits();
      *rounding = df->getRoundingIncrement();
    }
    *positive = ToUTF8String(dfs.getSymbol(DecimalFormatSymbols::kPlusSignSymbol));
    *negative = ToUTF8String(dfs.getSymbol(DecimalFormatSymbols::kMinusSignSymbol));
    *decimal = ToUTF8String(dfs.getSymbol(DecimalFormatSymbols::kDecimalSeparatorSymbol));
    *grouping = ToUTF8String(dfs.getSymbol(DecimalFormatSymbols::kGroupingSeparatorSymbol));

    return PlatformResult(ErrorCode::NO_ERROR);
  } else {
    return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not get number pattern");
  }
}

PlatformResult CordovaGlobalizationTools::GetCurrencyPattern(const std::string& code, std::string* pattern,
                                                   double* fraction, double* rounding,
                                                   std::string* decimal, std::string* grouping) {
  LoggerD("Entered");
  UErrorCode ec = U_ZERO_ERROR;
  UnicodeString res;
  Locale l = GetDefaultLocale();

  if (code.length() >= 3) {
    std::unique_ptr<NumberFormat> nfmt(NumberFormat::createCurrencyInstance(l, ec));
    if (U_ZERO_ERROR >= ec) {
      UChar currency[3] = {code[0], code[1], code[2]};
      nfmt->setCurrency(currency,ec);
      if (U_ZERO_ERROR >= ec) {
        icu::DecimalFormatSymbols dfs = DecimalFormatSymbols(l, ec);
        if (U_ZERO_ERROR >= ec) {
          if (DecimalFormat::getStaticClassID() != nfmt->getDynamicClassID()) {
            LoggerE("Could not cast to DecimalFormat, operation failed");
            return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not cast to DecimalFormat");
          } else {
            LoggerE("Casting to DecimalFormat is allowed");
          }
          DecimalFormat* df = dynamic_cast<DecimalFormat*>(nfmt.get());
          if (df) {
            *pattern = ToUTF8String(df->toLocalizedPattern(res));

            // find currency symbol
            UnicodeString str;
            nfmt->format(123, str); // use fake value just to get currency symbol
            std::string formatted_currency = ToUTF8String(str);
            std::string currency_symbol = formatted_currency.substr(0, formatted_currency.find("123"));
            LoggerD("currency_symbol %s", currency_symbol.c_str());

            // replacing stub given from platform with correct symbol
            std::string currency_stub = "¤";  // core API returns it instead of currency symbol
            size_t found_pos = pattern->find(currency_stub, 0);
            while (string::npos != found_pos) {
              pattern->replace(found_pos, currency_stub.length(), currency_symbol);
              found_pos = pattern->find(currency_stub, found_pos);
            }

            LoggerD("new pattern %s", pattern->c_str());
            *fraction = df->getMaximumFractionDigits();
            *rounding = df->getRoundingIncrement();
            *decimal = ToUTF8String(dfs.getSymbol(DecimalFormatSymbols::kDecimalSeparatorSymbol));
            *grouping = ToUTF8String(dfs.getSymbol(DecimalFormatSymbols::kGroupingSeparatorSymbol));
            return PlatformResult(ErrorCode::NO_ERROR);
          }
        }
      }
    }
  }
  return PlatformResult(ErrorCode::UNKNOWN_ERR, "Could not get currency pattern");
}

}  // globalization
}  // cordova
}  // extension
