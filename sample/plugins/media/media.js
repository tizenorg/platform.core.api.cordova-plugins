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

var deviceReady = function() {
  window.logger.log('Device ready');
};

var init = function () {
  window.logger.log('Media window loaded');
  document.addEventListener('deviceready', deviceReady, true);
  window.logger.log('Listener device ready added');
};

window.onload = init;

var success = function() {
  window.logger.log('succes');
};

var error = function(e) {
  window.logger.log(e);
};

var media;
var myinterval;

function status(s, pos) {
  window.logger.log('status: ' + s + ', pos: ' + pos);
  if (s === Media.MEDIA_STOPPED) {
    window.logger.log('clearing interval');
    clearInterval(myinterval);
  }
}

function create() {
  var file = document.getElementById('inputFile').value;
  window.logger.log(file);
  try {
    media = new Media(file, success, error, status);
    window.logger.log('Media: ' + media);
  } catch (e) {
    window.logger.log(e);
  }
}

var clicked = false;

function updateProgress() {
  if (!media) {
    return;
  }

  window.logger.log('update progress');
  var progress = document.getElementById('progress'), value = 0;

  media.getCurrentPosition(function(pos) {
    window.logger.log('Get current position success 100 / ' + media.duration + " * "
        + pos);
    if (pos > 0) {
      value = Math.floor((100 / media.getDuration()) * pos);
    }
    progress.style.width = value + '%';
    window.logger.log('width: ' + progress.style.width);
  });
}

function play() {
  clicked = !clicked;
  var playBtn = document.getElementById('play');
  if (clicked) {
    playBtn.textContent = '||';
    window.logger.log('Playing: ');
    try {
      media.play();
      myinterval = setInterval(updateProgress, 100);
    } catch (e) {
      window.logger.log('Error ' + e);
    }
  } else {
    playBtn.textContent = '|>';
    window.logger.log('Pausing: ');
    try {
      media.pause();
    } catch (e) {
      window.logger.log("Error " + e);
    }
  }
}

function stop() {
  window.logger.log('clearing interval');
  clearInterval(myinterval);
  media.stop();
  var playBtn = document.getElementById('play');
  playBtn.textContent = '|>';
  window.logger.log('play released');
}

function release() {
  media.release();
  window.logger.log('media released');
}

function getPos() {
  window.logger.log('getPos');
  media.getCurrentPosition(function(pos) {
    window.logger.log(pos);
    alert(pos);
  }, function(err) {
    window.logger.log(err);
    alert(err);
  });
}

function setPos() {
  var pos = document.getElementById('setPosValue').value;
  window.logger.log('setPos');
  media.seekTo(pos);
}

function setVolume() {
  var volume = document.getElementById('setVolValue').value;
  window.logger.log('setVol: ' + volume);
  media.setVolume(volume);
}

function expand() {
  window.logger.log('expand');
  var progress = document.getElementById('progress');
  window.logger.log('width: ' + progress.style.width);
  progress.style.width = 40 + '%';
}

function recordAudio() {
  window.logger.log('recordAudio');
  media.startRecord();
}

function stopRecAudio() {
  window.logger.log('stopRecord');
  media.stopRecord();
}
