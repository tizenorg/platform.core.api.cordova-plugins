/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var utils_ = xwalk.utils;
var native_ = new utils_.NativeManager(extension);

///// Globalization //////
var selectorDateStr = 'date';
var selectorTimeStr = 'time';
var selectorDateAndTimeStr = selectorDateStr + ' and ' + selectorTimeStr;

var formatShortStr = 'short';
var formatMediumStr = 'medium';
var formatLongStr = 'long';
var formatFullStr = 'full';

var typeWide = 'wide';
var typeNarrow = 'narrow';
var itemMonths = 'months';
var itemDays = 'days';

var numberTypeDecimal = 'decimal';
var numberTypePercent = 'percent';
var numberTypeCurrency = 'currency';

var oneHourSeconds = 60*60;

function Globalization_getPreferredLanguage(successCb, errorCb) {
  // TODO Indicates the current language setting in the (LANGUAGE)_(REGION) syntax.
  // The language setting is in the ISO 630-2 format and the region setting is in the ISO 3166-1 format.
  tizen.systeminfo.getPropertyValue ('LOCALE',
    function (locale) {
      // replacing '_' with '-' to satisfy cordova language and region separator
      var result = locale.language.replace('_', '-');
      successCb( {'value': result} );
    },
    function(error) {
      console.log('Cordova, getLocaleName, An error occurred ' + error.message);
      errorCb(new GlobalizationError(GlobalizationError.UNKNOWN_ERROR ,
          'cannot retrieve language name'));
    }
  );
}

function Globalization_dateToString(timestamp, successCb, errorCb, options) {
  var formatLength = (options && options.formatLength) || formatShortStr;
  var selector = (options && options.selector) || selectorDateAndTimeStr;

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.FORMATTING_ERROR , native_.getErrorObject(result).message);
      native_.callIfPossible(errorCb, error);
    } else {
      successCb(native_.getResultObject(result));
    }
  };
  var callArgs = {
    formatLength: String(formatLength),
    selector: String(selector),
    timestamp: String(timestamp)
  };
  native_.call('CordovaGlobalization_dateToString', callArgs, callback);
}

function Globalization_stringToDate(dateString, successCb, errorCb, options) {
  var result = null;
  var formatLength = (options && options.formatLength) || formatShortStr;
  var selector = (options && options.selector) || selectorDateAndTimeStr;

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.PARSING_ERROR , native_.getErrorObject(result).message);
      native_.callIfPossible(errorCb, error);
    } else {
      successCb(native_.getResultObject(result));
    }
  };
  var callArgs = {
      formatLength: String(formatLength),
      selector: String(selector),
      dateString : String(dateString)
  };
  native_.call('CordovaGlobalization_stringToDate', callArgs, callback);
}

function Globalization_getDatePattern(successCb, errorCb, options) {
  var formatLength = (options && options.formatLength) || formatShortStr;
  var selector = (options && options.selector) || selectorDateAndTimeStr;

  var callback = function(result) {
    // Checking succes of gathering pattern
    var fullResult = {};
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.PATTERN_ERROR , native_.getErrorObject(result).message);
      native_.callIfPossible(errorCb, error);
      return;
    } else {
      // not calling success callback yet
      fullResult = native_.getResultObject(result);
    }

    // looking for missing pieces of fullResult object
    var currentDateTime = tizen.time.getCurrentDateTime();
    if (currentDateTime) {
      // TODO currently value as "GMT+09:00" will be returned,
      // to get value "Asia/Seoul" use .getTimezone() instead
      var timezoneAbbreviation = currentDateTime.getTimezoneAbbreviation();

      // TODO method secondsFromUTC returns inverted offset: if time zone is GMT+8, it will return -32,400.
      // TODO currently utcOffset will include DST additional hour if it is present, value will be
      // timezoneOffset = timezoneOffsetWithoutDST + DSTAdditionalOffset
      // if other behaviour is correct, just need to substract dstOffset from utcOffset
      var utcOffset = currentDateTime.secondsFromUTC() * (-1);
      var dstOffset = currentDateTime.isDST() ? oneHourSeconds : 0;

      //adding missing parts of result
      fullResult["timezone"] = timezoneAbbreviation;
      fullResult["utc_offset"] = utcOffset;
      fullResult["dst_offset"] = dstOffset;
      successCb(fullResult);
    } else {
      var error = new GlobalizationError(
          GlobalizationError.PATTERN_ERROR , "cannot get pattern");
      native_.callIfPossible(errorCb, error);
    }
  };
  var callArgs = {
      formatLength: String(formatLength),
      selector: String(selector)
  };
  native_.call('CordovaGlobalization_getDatePattern', callArgs, callback);
}

function Globalization_getDateNames(successCb, errorCb, options) {
  var type = (options && options.type) || typeWide;
  var item = (options && options.item) || itemMonths;

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.UNKNOWN_ERROR , native_.getErrorObject(result).message);
      native_.callIfPossible(errorCb, error);
    } else {
      successCb(native_.getResultObject(result));
    }
  };
  var callArgs = {
      type: String(type),
      item: String(item)
  };
  native_.call('CordovaGlobalization_getDateNames', callArgs, callback);
}

function Globalization_isDayLightSavingsTime(timestamp, successCb, errorCb) {
  var tzdate = new tizen.TZDate(new Date(timestamp)); //creates tzdate with local default timezone
  if (tzdate) {
    var result = tzdate.isDST();
    setTimeout( function() {
      successCb ( {'dst' : result} );
    }, 0);
  } else {
    setTimeout( function() {
      errorCb(new GlobalizationError(GlobalizationError.UNKNOWN_ERROR , "cannot get information"));
    }, 0);
  }
}

function Globalization_getFirstDayOfWeek(successCb, errorCb) {
  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.UNKNOWN_ERROR , native_.getErrorObject(result).message);
      native_.callIfPossible(errorCb, error);
    } else {
      successCb(native_.getResultObject(result));
    }
  };
  native_.call('CordovaGlobalization_getFirstDayOfWeek', {}, callback);
}

function Globalization_numberToString(number, successCb, errorCb, options) {
  var type = (options && options.type) || numberTypeDecimal;

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.FORMATTING_ERROR , native_.getErrorObject(result).message);
      native_.callIfPossible(errorCb, error);
    } else {
      successCb(native_.getResultObject(result));
    }
  };
  var callArgs = {
      number: String(number),
      type: String(type)
  };
  native_.call('CordovaGlobalization_numberToString', callArgs, callback);
}

function Globalization_stringToNumber(numberStr, successCb, errorCb, options) {
  var type = (options && options.type) || numberTypeDecimal;

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.PARSING_ERROR , native_.getErrorObject(result).message);
      native_.callIfPossible(errorCb, error);
    } else {
      var result = native_.getResultObject(result);
      result.value = Number(result.value);
      successCb(result);
    }
  };
  var callArgs = {
      number: String(numberStr),
      type: String(type)
  };
  native_.call('CordovaGlobalization_stringToNumber', callArgs, callback);
}

function Globalization_getNumberPattern(successCb, errorCb, options) {
  var type = (options && options.type) || numberTypeDecimal;

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.UNKNOWN_ERROR , native_.getErrorObject(result).message);
      native_.callIfPossible(errorCb, error);
    } else {
      successCb(native_.getResultObject(result));
    }
  };
  var callArgs = {
      type: String(type)
  };
  native_.call('CordovaGlobalization_getNumberPattern', callArgs, callback);
}

function Globalization_getCurrencyPattern(currencyCode, successCb, errorCb) {
  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.UNKNOWN_ERROR , native_.getErrorObject(result).message);
      native_.callIfPossible(errorCb, error);
    } else {
      successCb(native_.getResultObject(result));
    }
  };
  var callArgs = {
      currencyCode : String(currencyCode)
  };
  native_.call('CordovaGlobalization_getCurrencyPattern', callArgs, callback);
}


//TODO: remove when added to public cordova repository -> begin
var plugin_name = 'cordova-plugin-globalization.tizen.Globalization';
cordova.define(plugin_name, function(require, exports, module) {
//TODO: remove -> end
  exports = {
      getPreferredLanguage: function (successCb, errorCb, args) {
        Globalization_getPreferredLanguage(successCb, errorCb);
      },
      getLocaleName: function (successCb, errorCb, args) {
        Globalization_getPreferredLanguage(successCb, errorCb);
      },
      dateToString: function (successCb, errorCb, args) {
        Globalization_dateToString(args[0]['date'], successCb, errorCb, args[0]['options']);
      },
      stringToDate: function (successCb, errorCb, args) {
        Globalization_stringToDate(args[0]['dateString'], successCb, errorCb, args[0]['options']);
      },
      getDatePattern: function (successCb, errorCb, args) {
        Globalization_getDatePattern(successCb, errorCb, args[0]['options']);
      },
      getDateNames: function (successCb, errorCb, args) {
        Globalization_getDateNames(successCb, errorCb, args[0]['options']);
      },
      isDayLightSavingsTime: function (successCb, errorCb, args) {
        Globalization_isDayLightSavingsTime(args[0]['date'], successCb, errorCb);
      },
      getFirstDayOfWeek: function (successCb, errorCb, args) {
        Globalization_getFirstDayOfWeek(successCb, errorCb);
      },
      numberToString: function (successCb, errorCb, args) {
        Globalization_numberToString(args[0]['number'], successCb, errorCb, args[0]['options']);
      },
      stringToNumber: function (successCb, errorCb, args) {
        Globalization_stringToNumber(args[0]['numberString'], successCb, errorCb, args[0]['options']);
      },
      getNumberPattern: function (successCb, errorCb, args) {
        Globalization_getNumberPattern(successCb, errorCb, args[0]['options']);
      },
      getCurrencyPattern: function (successCb, errorCb, args) {
        Globalization_getCurrencyPattern(args[0]['currencyCode'], successCb, errorCb);
      }
  };
  require("cordova/exec/proxy").add("Globalization", exports);
  console.log('Loaded cordova.globalization API');
// TODO: remove when added to public cordova repository -> begin
});
exports = function(require) {
  require('cordova-tizen').addPlugin('cordova-plugin-globalization.globalization', plugin_name, 'runs');
};
// TODO: remove -> end
