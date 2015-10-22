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

//TODO dateToString would support only full length (one format is supprted),
//     but selector for getting only needed values is fully supported
Globalization.dateToString = function(date, successCb, errorCb, options) {
  // TODO add validation of parameters
  var result = null;
  var formatLength = formatFullStr;
  var selector = selectorDateAndTimeStr;
  console.log("options " + JSON.stringify(options));
  if (options) {
    formatLength = options.formatLength || formatFullStr;
    selector = options.selector || selectorDateAndTimeStr;
  }
  console.log("len: " + formatLength + " selector: " + selector);

  var tzdate = new tizen.TZDate(date);
  if (tzdate) {
    // TODO only one format length is supprted
    // "Wednesday, January 7, 2015, 12:33:15 PM"
    if (selectorDateStr === selector) {
      result = tzdate.toLocaleDateString();
    } else if (selectorTimeStr === selector) {
      result = tzdate.toLocaleTimeString();
    } else {
      result = tzdate.toLocaleString();
    }
  }

  if (result) {
    setTimeout( function() {
      successCb ({'value': result});
    }, 0);
  } else {
    setTimeout( function() {
      errorCb(new GlobalizationError(
          GlobalizationError.FORMATTING_ERROR , 'cannot format date string'));
    }, 0);
  }
}

//TODO implementation would try to convert string to Date using javascript Date object
// constructor, options are basically ignored
Globalization.stringToDate = function(dateString, successCb, errorCb, options) {
  // TODO add validation of parameters
  var d = new Date(dateString);
  if (!d.getTime()) {
    setTimeout( function() {
      errorCb(new GlobalizationError(
          GlobalizationError.PARSING_ERROR , 'cannot parse date from string'));
    }, 0);
  } else {
    var result = {
      year : d.getYear() + 1900,
      month : d.getMonth(),
      day : d.getDate(),
      hour : d.getHours(),
      minute : d.getMinutes(),
      second : d.getSeconds(),
      millisecond : d.getMilliseconds()
    };
    setTimeout( function() {
      successCb (result);
    }, 0);
  }
}

// TODO getDatePattern would support only short and full length,
// but selector for getting only needed values is fully supported
Globalization.getDatePattern = function(successCb, errorCb, options) {
  // TODO add validation of parameters
  var selector = selectorDateAndTimeStr;
  var isShortFormat = false;
  if (options) {
    selector = options.selector || selectorDateAndTimeStr;
    isShortFormat = (options.formatLength === formatShortStr);
  }
  var pattern = null;
  if (selectorTimeStr === selector) {
    pattern = tizen.time.getTimeFormat();
  } else if (selectorDateStr === selector) {
    pattern = tizen.time.getDateFormat(isShortFormat);
  } else {
    // TODO in tizen there is no unified date and time format getter
    // (for now implementation separates date and time formats with colon ','
    pattern = tizen.time.getDateFormat(isShortFormat) + ", " + tizen.time.getTimeFormat();
  }

  var currentDateTime = tizen.time.getCurrentDateTime();
  if (pattern && currentDateTime) {
    // TODO currently value as "GMT+09:00" will be returned,
    // to get value "Asia/Seoul" use .getTimezone() instead
    var timezoneAbbreviation = currentDateTime.getTimezoneAbbreviation();

    // TODO method secondsFromUTC returns inverted offset: if time zone is GMT+8, it will return -32,400.
    // TODO currently utcOffset will include DST additional hour if it is present, value will be
    // timezoneOffset = timezoneOffsetWithoutDST + DSTAdditionalOffset
    // if other behaviour is correct, just need to substract dstOffset from utcOffset
    var utcOffset = currentDateTime.secondsFromUTC() * (-1);
    var dstOffset = currentDateTime.isDST() ? oneHourSeconds : 0;

    var result = {
      "pattern": pattern,
      "timezone": timezoneAbbreviation,
      "utc_offset": utcOffset,
      "dst_offset": dstOffset
    };
    setTimeout( function() {
      successCb (result);
    }, 0);
  } else {
    errorCb(new GlobalizationError(GlobalizationError.PATTERN_ERROR , "cannot get pattern"));
  }
}

// TODO implement this as native method
Globalization.getDateNames = function(successCb, errorCb, options) {
  // TODO add validation of parameters
  setTimeout( function() {
    errorCb(new GlobalizationError(GlobalizationError.UNKNOWN_ERROR , "unsupported"))
  }, 0);
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

//TODO implement this as native method
Globalization.getFirstDayOfWeek = function(successCb, errorCb) {
  // TODO add validation of parameters
  setTimeout( function() {
    errorCb(new GlobalizationError(GlobalizationError.UNKNOWN_ERROR , "unsupported"))
  }, 0);
}

//TODO how to implement this??
Globalization.numberToString = function(number, successCb, errorCb, options) {
  // TODO add validation of parameters
  var result = number.toLocaleString();
  setTimeout( function() {
    successCb ( {'value' : result} );
  }, 0);
}

//TODO how should look this implementation about options??
Globalization.stringToNumber = function(numberStr, successCb, errorCb, options) {
  // TODO add validation of parameters
  var result = Number(numberStr);
  if ('NaN' != result.toString()) {
    setTimeout( function() {
      successCb ( {'value' : result} );
    }, 0);
  } else {
    setTimeout( function() {
      errorCb(new GlobalizationError(GlobalizationError.PARSING_ERROR ,
          "cannot convert string to number"))
    }, 0);
  }
}

//TODO how to implement this??
Globalization.getNumberPattern = function(successCb, errorCb, options) {
  // TODO add validation of parameters
  setTimeout( function() {
    errorCb(new GlobalizationError(GlobalizationError.UNKNOWN_ERROR , "unsupported"))
  }, 0);
}

//TODO how to implement this??
Globalization.getCurrencyPattern = function(currencyCode, successCb, errorCb) {
  // TODO add validation of parameters
  setTimeout( function() {
    errorCb(new GlobalizationError(GlobalizationError.UNKNOWN_ERROR , "unsupported"))
  }, 0);
}

_navigator.globalization = Globalization;

console.log('Loaded cordova.globalization API');
