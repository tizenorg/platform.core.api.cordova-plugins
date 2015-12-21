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
  function onDeviceReady() {
    document.addEventListener('backbutton', function() {
      window.history.back();
    }, false);

    var info = document.getElementById('infoField');

    function callbackBuilder(value) {
      return function() {
        info.innerHTML = value;
      };
    }

    for (var p in device) {
      if (device.hasOwnProperty(p)) {
        var x = document.getElementById('device-' + p);
        if (x) {
          x.addEventListener('click', callbackBuilder(device[p]));
        }
      }
    }
  }

  document.addEventListener('deviceready', onDeviceReady, false);
})();