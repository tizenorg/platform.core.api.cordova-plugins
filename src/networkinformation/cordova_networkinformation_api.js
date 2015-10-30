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

var _global = window || global || {};

var Connection = {
  UNKNOWN: "unknown",
  ETHERNET: "ethernet",
  WIFI: "wifi",
  CELL_2G: "2g",
  CELL_3G: "3g",
  CELL_4G: "4g",
  CELL:"cellular",
  NONE: "none"
};

var type = Connection.UNKNOWN;

var connection = {};

Object.defineProperty(connection, 'type', {
  get: function() { return type; },
  set: function() {},
  enumerable: true
});

var network = {
  connection: connection
};

function onSuccessCallback(info) {
  switch (info.networkType) {
    case "NONE":
      type = Connection.NONE;
      break;
    case "2G":
      type = Connection.CELL_2G;
      break;
    case "2.5G":
      // TODO consider. In cordova documentation there is no information about 2.5G
      // so instead 2G is returned
      type = Connection.CELL_2G;
      break;
    case "3G":
      type = Connection.CELL_3G;
      break;
    case "4G":
      type = Connection.CELL_4G;
      break;
    case "WIFI":
      type = Connection.WIFI;
      break;
    case "ETHERNET":
      type = Connection.ETHERNET;
      break;
    default:
      type = Connection.UNKNOWN;
      break;
  }

  if (Connection.NONE === type || Connection.UNKNOWN === type) {
    document.dispatchEvent(new Event("offline"));
  } else {
    document.dispatchEvent(new Event("online"));
  }
}

function onErrorCallback(e) {
  type = Connection.UNKNOWN;
  console.error("Error appeared " + e.name + ", message "+ e.message);
}

tizen.systeminfo.getPropertyValue("NETWORK", onSuccessCallback, onErrorCallback);
// TODO currently method addPropertyValueChangeListener is registered only to SIM1 and
// ignore changes on SIM2 (if device has dual SIM standby mode). Consider to use
// method addPropertyValueChangeListenerArray to get information from both SIM, but
// which type should be returned then?
tizen.systeminfo.addPropertyValueChangeListener("NETWORK", onSuccessCallback, onErrorCallback);

_global.Connection = Connection;
_global.navigator.connection = connection;
_global.navigator.network = network;

console.log('Loaded cordova.networkinformation API');

exports = function(require) {
};
