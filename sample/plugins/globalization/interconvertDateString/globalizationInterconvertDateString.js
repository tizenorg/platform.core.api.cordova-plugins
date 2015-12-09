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
    if ('' == document.getElementById('interconvert'+type).value) {
      return true;
    }
    return false;
  }

  function convertToString() {
    info.innerHTML = 'Please wait ...';
    var f = document.getElementById('selector-format').value;
    var s = document.getElementById('selector-selector').value;
    var n = new Date(document.getElementById('interconvertDate').value);

    navigator.globalization.dateToString(n,
        function (date) {
          document.getElementById('interconvertString').value = date.value;
          clearInfo();
          info.innerHTML = 'String ' + document.getElementById('interconvertDate').value +
          ' convert to String ' + date.value;
        },
        function (e) { info.innerHTML = 'Error while convert to String '+ e.name; },
        { formatLength: f, selector: s }
    );
  }

  function convertToDate() {
    info.innerHTML = 'Please wait ...';
    var f = document.getElementById('selector-format').value;
    var s = document.getElementById('selector-selector').value;
    var n = document.getElementById('interconvertString').value;

    navigator.globalization.stringToDate(n,
        function (date) {
          clearInfo();
          info.innerHTML = 'String ' + document.getElementById('interconvertString').value +
          ' convert to Date </br> month: ' + date.month +
          '</br> day: ' + date.day +
          '</br> year: ' + date.year +
          '</br> hour: ' + date.hour +
          '</br> minute: ' + date.minute +
          '</br> second: ' + date.second +
          '</br> millisecond: ' + date.millisecond;
        } ,
        function (e) { info.innerHTML = 'Error while convert to Date '+ e.name; },
        { formatLength: f, selector: s }
    );
  }

  var action = {
    'Date' : function() {
      if (checkIfEmpty('String')) {
        alert('String field is empty!')
      } else {
        convertToDate();
      }
    },
    'String' : function() {
      if (checkIfEmpty('Date')) {
        alert('Date field is empty!')
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
    document.getElementById('interconvertDate').value = new Date();
  }
})();