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

// a set of functions enabling the user to display
// some (very) simple messages in a HTML object.
// includes logging text and time, as well as clearing logs.
// Creates a global reference: window.logger.

// @author: Adam Szczerbiak (a.szczerbiak@samsung.com)
// created: 2015-11-24
// last modified: 2015-11-30

var SimpleLogger = {};
SimpleLogger.TARGET_ID = 'resultsLog';
SimpleLogger.contents = '';

SimpleLogger.clear = function() {
  this.contents = '';
  document.getElementById(this.TARGET_ID).innerHTML = this.contents;
};

SimpleLogger.getNiceTime = function() {
  var time, nicetime;
  time = new Date();
  nicetime = ('0' + time.getHours()).slice(-2) + ':'
      + ('0' + time.getMinutes()).slice(-2) + ':'
      + ('0' + time.getSeconds()).slice(-2);
  return nicetime;
};

SimpleLogger.log = function(text) {
  this.contents += text + '<br>';
  document.getElementById(this.TARGET_ID).innerHTML = this.contents;
  console.log(text);
};

SimpleLogger.logWithTimestamp = function(text) {
  this.log('[' + this.getNiceTime() + '] ' + text);
};

/////////////////////////////////////////////////////////////////////////

window.logger = SimpleLogger;