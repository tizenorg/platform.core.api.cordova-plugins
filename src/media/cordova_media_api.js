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

function Media(src, mediaSuccess, mediaError, mediaStatus) {
    this.src = src;
    this.mediaSuccess = mediaSuccess;
    this.mediaError = mediaError;
    this.mediaStatus = mediaStatus;
}

Media.prototype.getCurrentPosition = function(mediaSuccess, mediaError){}

Media.prototype.getDuration = function(){};

Media.prototype.pause = function(){};

Media.prototype.play = function(){};

Media.prototype.release = function(){};

Media.prototype.seekTo = function(miliseconds){};

Media.prototype.setVolume = function(volume){};

Media.prototype.startRecord = function(){};

Media.prototype.stop = function(){};

Media.prototype.stopRecord = function(){};

_global.Media = Media;

cordova._broker.addEventListener('deviceready', function (event) {
  if ('addEventListener' === event.fun) {
    event.obj.dispatchEvent(new Event('deviceready'));
  }
});

console.log('Loaded cordova.device API');
