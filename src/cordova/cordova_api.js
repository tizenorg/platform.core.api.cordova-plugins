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
var _document = document || {};

function Emitter() {
  var eventTarget = _document.createDocumentFragment();

  function delegate(method) {
    this[method] = eventTarget[method].bind(eventTarget);
  }

  [
    'addEventListener',
    'dispatchEvent',
    'removeEventListener'
  ].forEach(delegate, this);
}

function createEvent(n, obj, fun) {
  var e = new Event(n);
  e.obj = obj;
  e.fun = fun;
  return e;
}

function wrapFunction(obj, fun) {
  var old = obj[fun];
  obj[fun] = function() {
    old.apply(obj, arguments);
    cordova._broker.dispatchEvent(createEvent(arguments[0], obj, fun));
  };
}

wrapFunction(_global, 'addEventListener');
wrapFunction(_global, 'removeEventListener');
wrapFunction(_document, 'addEventListener');
wrapFunction(_document, 'removeEventListener');

var cordova = {
  version: '5.1.1',
  _broker: new Emitter()
};

_global.cordova = cordova;

console.log('Loaded cordova API');
