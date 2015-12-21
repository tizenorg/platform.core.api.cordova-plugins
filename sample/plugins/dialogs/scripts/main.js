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

  var action = {
    beep: function() {
      navigator.notification.beep(3);
    },
    alert: function() {
      clearInfo();
      navigator.notification.alert('Very important message from Cordova.', function() {
        updateInfo('The Cordova alert dialog has been dismissed.');
      }, 'Cordova alert dialog', 'Great!');
    },
    confirm: function() {
      clearInfo();

      var buttons = ['Yes', 'Sure', 'Certainly'];

      navigator.notification.confirm('Coffee?', function(idx) {
        if (idx > 0) {
          updateInfo('The Cordova confirm dialog has been closed with button: ' + buttons[idx - 1]);
        } else {
          updateInfo('The Cordova confirm dialog has been dismissed.');
        }
      }, 'Cordova confirm dialog', buttons);
    },
    prompt: function() {
      clearInfo();

      var buttons = ['Confirm', 'Repeat', 'Decline'];

      navigator.notification.prompt('What... is your favourite colour?', function(r) {
        if (r.buttonIndex > 0) {
          var msg = 'The Cordova prompt dialog has been closed with button: ' + buttons[r.buttonIndex - 1] + '. User input';
          if (r.input1) {
            msg += ': \"' + r.input1 + '\".';
          } else {
            msg += ' is empty.';
          }
          updateInfo(msg);
        } else {
          updateInfo('The Cordova prompt dialog has been dismissed.');
        }
      }, 'Cordova prompt dialog', buttons, 'Blue. No, yel...');
    },
    'native-alert': function() {
      clearInfo();
      window.alert('This is a built-in alert dialog.');
      updateInfo('The built-in alert dialog has been dismissed.');
    },
    'native-confirm': function() {
      clearInfo();

      if (window.confirm('This is a built-in confirm dialog.')) {
        updateInfo('The built-in confirm dialog has been closed with button: OK');
      } else {
        updateInfo('The built-in confirm dialog has been closed with button: Cancel');
      }
    },
    'native-prompt': function() {
      clearInfo();

      var input = window.prompt('This is a built-in prompt dialog.', 'Default value');

      if (input) {
        updateInfo('The built-in prompt dialog has been closed with button: OK. User input: \"' + input + '\".');
      } else if ('' === input) {
        updateInfo('The built-in prompt dialog has been closed with button: OK. User input is empty.');
      } else {
        updateInfo('The built-in prompt dialog has been closed with button: Cancel.');
      }
    }
  };

  function onDeviceReady() {
    document.addEventListener('backbutton', function() {
      window.history.back();
    }, false);

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
    info = document.getElementById('infoField');
  }
})();
