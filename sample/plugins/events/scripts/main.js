/*
 * Copyright (c) 2014-2015 Telerik AD
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

(function() {
  var info, events = [
    'pause',
    'resume',
    'backbutton',
    'menubutton',
    'searchbutton',
    'startcallbutton',
    'endcallbutton',
    'volumedownbutton',
    'volumeupbutton'
  ];

  function printEvent(text) {
    var newDiv = document.createElement('div'),
        currentTime = new Date().toLocaleTimeString().split(' ')[0];
    newDiv.innerHTML = '[' + currentTime + '] ' + text;

    info.appendChild(newDiv);
    // scroll to bottom
    info.scrollTop = info.scrollHeight;
    console.log(newDiv.innerHTML);
  }

  function callbackBuilder(e) {
    return function() {
      printEvent(e);
    };
  }

  function onDeviceReady() {
    printEvent('deviceready');

    for (var i = 0; i < events.length; ++i) {
      document.addEventListener(events[i], callbackBuilder(events[i]), false);
    }
  }

  document.addEventListener('deviceready', onDeviceReady, false);

  window.onload = function() {
    info = document.getElementById('infoField');

    // using UI button to go back, so we can press hardware back as many times as we want
    document.getElementById('back').addEventListener('click', function() {
      window.history.back();
    });
  };
})();
