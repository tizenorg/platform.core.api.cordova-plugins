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

  function checkIfEmpty(type) {
    if ('' == document.getElementById('interconver'+type).value) {
      return true;
    }
    return false;
  }

  function convertToString() {
    info.innerHTML = 'Please wait ...';
    var t = document.getElementById('selector-type').value;
    var n = Number(document.getElementById('interconverNumber').value);

    navigator.globalization.numberToString(n,
        function (number) {
          document.getElementById('interconverString').value = number.value;
          clearInfo();
        },
        function (e) { info.innerHTML = 'Error while convert to String '+ e.name; },
        {type : t}
    );
  }

  function convertToNumber() {
    info.innerHTML = 'Please wait ...';
    var t = document.getElementById('selector-type').value;
    var n = document.getElementById('interconverString').value;

    navigator.globalization.stringToNumber(n,
        function (number) {
          document.getElementById('interconvertNumber').value = number.value;
          clearInfo()
        },
        function (e) { info.innerHTML = 'Error while convert to Number '+ e.name; },
        {type : t}
    );
  }

  var action = {
    'Number' : function() {
      if (checkIfEmpty('String')) {
        alert('String field is empty!')
      } else {
        convertToNumber();
      }
    },
    'String' : function() {
      if (checkIfEmpty('Number')) {
        alert('Number field is empty!')
      } else {
        convertToString();
      }
    }
  }

  function onDeviceReady() {
    document.addEventListener('backbutton', function() {
      window.history.back();
    });

    for (var a in action) {
      if (action.hasOwnProperty(a)) {
        var x = document.getElementById('button-' + a);
        if (x) {
          x.addEventListener('click', action[a]);
        }
      }
    }
  }

  document.addEventListener('deviceready', onDeviceReady, false);

  window.onload = function() {
    info = document.getElementById('messageResult');
  }
})();