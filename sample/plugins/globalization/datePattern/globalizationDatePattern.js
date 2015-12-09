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

  function getDatePattern() {
    info.innerHTML = 'Please wait ...';
    var f = document.getElementById('selector-format').value;
    var s = document.getElementById('selector-selector').value;

    navigator.globalization.getDatePattern(
        function (date) { info.innerHTML = 'pattern : ' + date.pattern + '</br>' +
                                           'timezone : ' + date.timezone + '</br>' +
                                           'utc_offset : ' + date.utc_offset + '</br>' +
                                           'dst_offset : ' + date.dst_offset + '</br>'; },
        function (e) { info.innerHTML = 'Error while getting date pattern '+ e.name; },
        { formatLength: f, selector: s }
    );
  }

  var action = {
    'format' : function() {
      getDatePattern();
    },
    'selector' : function() {
      getDatePattern();
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
    getDatePattern();
  }
})();