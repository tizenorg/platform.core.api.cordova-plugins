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

var native_ = new xwalk.utils.NativeManager(extension);

var ONE_HOUR_SECONDS = 60 * 60;

function GlobalizationManager() {}

GlobalizationManager.prototype.dateToString = function(timestamp, formatLength, selector, successCb, errorCb) {
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
};

GlobalizationManager.prototype.stringToDate = function(dateString, formatLength, selector, successCb, errorCb) {
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
};

GlobalizationManager.prototype.getDatePattern = function(formatLength, selector, successCb, errorCb) {
  var callback = function(result) {
    // Checking success of gathering pattern
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
      // TODO method secondsFromUTC returns inverted offset: if time zone is GMT+8, it will return -32,400.
      // TODO currently utcOffset will include DST additional hour if it is present, value will be
      // timezoneOffset = timezoneOffsetWithoutDST + DSTAdditionalOffset
      // if other behavior is correct, just need to subtract dstOffset from utcOffset
      var utcOffset = currentDateTime.secondsFromUTC() * (-1);
      var dstOffset = currentDateTime.isDST() ? ONE_HOUR_SECONDS : 0;

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
};

GlobalizationManager.prototype.getDateNames = function(type, item, successCb, errorCb) {
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
};

GlobalizationManager.prototype.getFirstDayOfWeek = function(successCb, errorCb) {
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
};

GlobalizationManager.prototype.numberToString = function(number, type, successCb, errorCb) {
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
};

GlobalizationManager.prototype.stringToNumber = function(numberStr, type, successCb, errorCb) {
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
};

GlobalizationManager.prototype.getNumberPattern = function(type, successCb, errorCb) {
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
};

GlobalizationManager.prototype.getCurrencyPattern = function(currencyCode, successCb, errorCb) {
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
};

exports = new GlobalizationManager();
