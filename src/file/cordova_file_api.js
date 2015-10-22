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

var Metadata = function(metadata) {
  if (typeof metadata == "object") {
    this.modificationTime = new Date(metadata.modificationTime);
    this.size = metadata.size || 0;
  } else if (typeof metadata == "undefined") {
    this.modificationTime = null;
    this.size = 0;
  }
};

_global.Metadata = Metadata;

console.log('Loaded cordova.file API');
