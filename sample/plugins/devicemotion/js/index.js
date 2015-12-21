/*
 * Copyright (c) 2014-2015 Telerik AD
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

var watchId = null;


function onErrorCb() {
  alert('Error!');
}


var App = function() {
}


App.prototype = {
  run: function() {
    var that = this;
    document.getElementById('getAccel').addEventListener('click', function() {
      that.getCurrentAccel();
    });
    document.getElementById('watchOper').addEventListener('click', function() {
      document.getElementById('watchOper').disabled = true;
      if (watchId) {  // Stop watching
        that.stopWatch();
      } else {  // Start watching
        that.startWatch();
      }
    });
  },
  getCurrentAccel: function() {
    console.log('getAccel');
    var onSuccessCb = function(accel) {
      document.getElementById('x_value').innerHTML = Math.round(accel.x * 100);
      document.getElementById('y_value').innerHTML = Math.round(accel.y * 100);
      document.getElementById('z_value').innerHTML = Math.round(accel.z * 100);
    };
    navigator.accelerometer.getCurrentAcceleration(onSuccessCb, onErrorCb);
  },
  startWatch: function() {
    console.log('start watching');
    var onSuccessCb = function(accel) {
      document.getElementById('x_value').innerHTML = Math.round(accel.x * 100);
      document.getElementById('y_value').innerHTML = Math.round(accel.y * 100);
      document.getElementById('z_value').innerHTML = Math.round(accel.z * 100);
    };
    watchId = navigator.accelerometer.watchAcceleration(onSuccessCb, onErrorCb, { frequency: 1000 });
    document.getElementById('watchOper').innerHTML = 'Stop Watching';
    document.getElementById('watchOper').disabled = false;
    document.getElementById('getAccel').disabled = true;
  },
  stopWatch: function() {
    console.log('stop watching');
    document.getElementById('watchOper').innerHTML = 'Watch acceleration';
    document.getElementById('watchOper').disabled = false;
    document.getElementById('getAccel').disabled = false;
    navigator.accelerometer.clearWatch(watchId);
    watchId = null;
  }
}


// onDeviceReady callback
function onDeviceReady() {
  document.addEventListener('backbutton', function() {
    window.history.back();
  });
  var app = new App();
  app.run();
}


//Initialize function
var init = function () {
  document.addEventListener('deviceready', onDeviceReady, false);
};

window.onload = init;
