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

exports.defineAutoTests = function () {
};

exports.defineManualTests = function (content, createActionButton) {
  var logMessage = function (message) {
    var log = document.getElementById('info');
    var logLine = document.createElement('div');
    logLine.innerHTML = message;
    log.appendChild(logLine);
    console.log(message);
  };

  var clearLog = function () {
    var log = document.getElementById('info');
    log.innerHTML = '';
  };

  var callback;
  var current_event;

  var prepareTest = function (e) {
    clearLog();
    if (current_event) {
      document.removeEventListener(current_event, callback);
    }
    current_event = e;
    var i = 0;
    callback = function () {
      logMessage('Event \"' + e + '\" has been fired ' + (++i) + ' time(s).');
    };
    document.addEventListener(current_event, callback);
  }

  var events_tests = '<p/> <div id="deviceready"></div>' +
      'Expected result: \"deviceready\" event should be fired exactly once.' +
      '<p/> <div id="pause"></div>' +
      'Expected result: \"pause\" event should be fired each time application is hidden (i.e. device is locked when application is running).' +
      '<p/> <div id="resume"></div>' +
      'Expected result: \"resume\" event should be fired each time application is shown (i.e. device is unlocked when application is running in foreground).' +
      '<p/> <div id="backbutton"></div>' +
      'Expected result: \"backbutton\" event should be fired each time \"Back\" key is pressed.' +
      '<p/> <div id="menubutton"></div>' +
      'Expected result: \"menubutton\" event should be fired each time \"Menu\" key is pressed.' +
      '<p/> <div id="searchbutton"></div>' +
      'Expected result: \"searchbutton\" event should be fired each time \"Search\" key is pressed.' +
      '<p/> <div id="startcallbutton"></div>' +
      'Expected result: \"startcallbutton\" event should be fired each time \"Start call\" key is pressed.' +
      '<p/> <div id="endcallbutton"></div>' +
      'Expected result: \"endcallbutton\" event should be fired each time \"End call\" key is pressed.' +
      '<p/> <div id="volumedownbutton"></div>' +
      'Expected result: \"volumedownbutton\" event should be fired each time \"Volume down\" key is pressed.' +
      '<p/> <div id="volumeupbutton"></div>' +
      'Expected result: \"volumeupbutton\" event should be fired each time \"Volume up\" key is pressed.';

  content.innerHTML = '<div id="info"></div>' + events_tests;

  createActionButton('Event: deviceready', function () {
    prepareTest('deviceready');
  }, 'deviceready');

  createActionButton('Event: pause', function () {
    prepareTest('pause');
  }, 'pause');

  createActionButton('Event: resume', function () {
    prepareTest('resume');
  }, 'resume');

  createActionButton('Event: backbutton', function () {
    prepareTest('backbutton');
  }, 'backbutton');

  createActionButton('Event: menubutton', function () {
    prepareTest('menubutton');
  }, 'menubutton');

  createActionButton('Event: searchbutton', function () {
    prepareTest('searchbutton');
  }, 'searchbutton');

  createActionButton('Event: startcallbutton', function () {
    prepareTest('startcallbutton');
  }, 'startcallbutton');

  createActionButton('Event: endcallbutton', function () {
    prepareTest('endcallbutton');
  }, 'endcallbutton');

  createActionButton('Event: volumedownbutton', function () {
    prepareTest('volumedownbutton');
  }, 'volumedownbutton');

  createActionButton('Event: volumeupbutton', function () {
    prepareTest('volumeupbutton');
  }, 'volumeupbutton');
};
