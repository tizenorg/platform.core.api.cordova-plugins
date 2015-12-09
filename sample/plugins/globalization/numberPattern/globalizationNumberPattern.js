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
  var info;
  function updateInfo(msg) {
    info.innerHTML = msg;
  }

  function clearInfo() {
    updateInfo('');
  }

  function getNumberPattern() {
    info.innerHTML = 'Please wait ...';
    var t = document.getElementById('selector-type').value;
    navigator.globalization.getNumberPattern(
        function (pattern) { info.innerHTML = 'pattern : ' + pattern.pattern + '</br>' +
                                           'symbol : ' + pattern.symbol + '</br>' +
                                           'fraction : ' + pattern.fraction + '</br>' +
                                           'rounding : ' + pattern.rounding + '</br>' +
                                           'positive : ' + pattern.positive + '</br>' +
                                           'negative : ' + pattern.negative + '</br>' +
                                           'decimal : ' + pattern.decimal + '</br>' +
                                           'grouping : ' + pattern.grouping + '</br>'; },
        function (e) { info.innerHTML = 'Error while getting number pattern '+ e.name; },
        { type: t }
    );
  }

  var action = {
    'type' : function() {
      getNumberPattern();
    }
  }

  function onDeviceReady() {
    document.addEventListener('backbutton', function() {
      window.history.back();
    });

    for (var a in action) {
      if (action.hasOwnProperty(a)) {
        var x = document.getElementById('selector-' + a);
        if (x) {
          x.addEventListener('change', action[a]);
        }
      }
    }
  }

  document.addEventListener('deviceready', onDeviceReady, false);

  window.onload = function() {
    info = document.getElementById('messageResult');
    getNumberPattern();
  }
})();