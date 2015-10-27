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

var utils_ = xwalk.utils;
var native_ = new utils_.NativeManager(extension);

var _navigator = navigator || {};
var _global = window || global || {};

///// GlobalizationError //////
var GlobalizationError = function(code, message) {
  this.code = code;
  this.name = 'GlobalizationError';
  this.message = message || 'Default Message';
  this.stack = (new Error()).stack;
};

GlobalizationError.prototype = Object.create(Error.prototype);
GlobalizationError.prototype.constructor = GlobalizationError;

GlobalizationError.UNKNOWN_ERROR = 0;
GlobalizationError.FORMATTING_ERROR = 1;
GlobalizationError.PARSING_ERROR = 2;
GlobalizationError.PATTERN_ERROR = 3;

_global.GlobalizationError = GlobalizationError;


///// Globalization //////
var selectorDateStr = 'date';
var selectorTimeStr = 'time';
var selectorDateAndTimeStr = selectorDateStr + ' and ' + selectorTimeStr;

//TODO how to support all those lenghts??
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

var Globalization = {};

Globalization.getPreferredLanguage = function(successCb, errorCb) {
  // TODO add validation of parameters
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

Globalization.getLocaleName = function(successCb, errorCb) {
  Globalization.getPreferredLanguage(successCb, errorCb);
}

//TODO JS implementation of dateToString would support only full length (one format is supprted),
//     but selector for getting only needed values is fully supported
Globalization.dateToString = function(date, successCb, errorCb, options) {
  // TODO add validation of parameters
  var result = null;
  var formatLength = formatFullStr;
  var selector = selectorDateAndTimeStr;
  if (options) {
    formatLength = options.formatLength || formatFullStr;
    selector = options.selector || selectorDateAndTimeStr;
  }

  var timestamp = date.getTime();
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

//TODO implementation would try to convert string to Date using javascript Date object
// constructor, options are basically ignored
Globalization.stringToDate = function(dateString, successCb, errorCb, options) {
  // TODO add validation of parameters
  var result = null;
  var formatLength = formatFullStr;
  var selector = selectorDateAndTimeStr;
  if (options) {
    formatLength = options.formatLength || formatFullStr;
    selector = options.selector || selectorDateAndTimeStr;
  }

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

Globalization.getDatePattern = function(successCb, errorCb, options) {
  // TODO add validation of parameters
  var formatLength = formatFullStr;
  var selector = selectorDateAndTimeStr;

  if (options) {
    formatLength = options.formatLength || formatFullStr;
    selector = options.selector || selectorDateAndTimeStr;
  }

  var callback = function(result) {
    // Checking succes of gathering pattern
    var fullResult = {};
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.PATTERN_ERROR , native_.getErrorObject(result).message)
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

Globalization.getDateNames = function(successCb, errorCb, options) {
  // TODO add validation of parameters
  var type = typeWide;
  var item = itemDays;
  if (options) {
    type = options.type || typeWide;
    item = options.item || itemDays;
  }

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.UNKNOWN_ERROR , native_.getErrorObject(result).message)
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

Globalization.isDayLightSavingsTime = function(date, successCb, errorCb) {
  // TODO add validation of parameters
  var tzdate = new tizen.TZDate(date); //creates tzdate with local default timezone
  if (tzdate) {
    var result = tzdate.isDST();
    setTimeout( function() {
      successCb ( {'dst' : result} );
    }, 0);
  } else {
    setTimeout( function() {
      errorCb(new GlobalizationError(GlobalizationError.UNKNOWN_ERROR , "cannot get information"))
    }, 0);
  }
}

Globalization.getFirstDayOfWeek = function(successCb, errorCb) {
  // TODO add validation of parameters
  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.UNKNOWN_ERROR , native_.getErrorObject(result).message)
      native_.callIfPossible(errorCb, error);
    } else {
      successCb(native_.getResultObject(result));
    }
  };
  native_.call('CordovaGlobalization_getFirstDayOfWeek', {}, callback);
}

Globalization.numberToString = function(number, successCb, errorCb, options) {
  // TODO add validation of parameters
  var type = numberTypeDecimal;
  if (options) {
    type = options.type || numberTypeDecimal;
  }

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.FORMATTING_ERROR , native_.getErrorObject(result).message)
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

Globalization.stringToNumber = function(numberStr, successCb, errorCb, options) {
  // TODO add validation of parameters
  var type = numberTypeDecimal;
  if (options) {
    type = options.type || numberTypeDecimal;
  }

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.PARSING_ERROR , native_.getErrorObject(result).message)
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

Globalization.getNumberPattern = function(successCb, errorCb, options) {
  // TODO add validation of parameters
  var type = numberTypeDecimal;
  if (options) {
    type = options.type || numberTypeDecimal;
  }

  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.UNKNOWN_ERROR , native_.getErrorObject(result).message)
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

Globalization.getCurrencyPattern = function(currencyCode, successCb, errorCb) {
  // TODO add validation of parameters
  var callback = function(result) {
    if (native_.isFailure(result)) {
      var error = new GlobalizationError(
          GlobalizationError.UNKNOWN_ERROR , native_.getErrorObject(result).message)
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

_navigator.globalization = Globalization;

console.log('Loaded cordova.globalization API');
