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

var media;
var myinterval;
var table;
var lastIndex;
var playfiles = {};
var recording;
var playPause;

var deviceReady = function () {
  console.log('Device ready');

  document.addEventListener('backbutton', function() {
    window.history.back();
  }, false);

  getDirectoryContents('documents', function (files) {
    var i;
    for (i = 0; i < files.length; i++) {
      console.log(files[i].fullPath);
      if(!(files[i].name in playfiles) ){
        playfiles[files[i].name] =  files[i];
        table.row.add([i + '.', '/opt/usr/media/Documents/' + files[i].name]).draw(false);
      }
    }
  });
};

var init = function () {
  console.log('Media window loaded');
  document.addEventListener('deviceready', deviceReady, true);
  console.log('Listener device ready added');
  playPause = false;
};

window.onload = init;

$(document).ready(function () {
  table = $('#example').DataTable({
    select: 'single',
    bLengthChange: false,
    paging: true,
    searching: false,
    info: false,
    scrollY: 100,
    scroller: true
  });

  table.on('select', function (e, dt, type, indexes) {
    if (type === 'row') {
      document.getElementById('inputFile').value = table.row(indexes).data()[1];
      create();
      lastIndex = table.row(indexes).data()[0].split('')[0];
    }
  });
});

var success = function () {
  console.log('succes');
};

var error = function (e) {
  console.log(e);
};

function status(s, pos) {
  console.log('status: ' + s + ', pos: ' + pos);
  if (s === Media.MEDIA_STOPPED) {
    console.log('clearing interval');
    clearInterval(myinterval);
  }
}

function create() {
  if (media != null) {
    release();
  }
  var file = document.getElementById('inputFile').value;
  console.log(file);
  try {
    media = new Media(file, success, error, status);
    console.log('Media: ' + media);
  } catch (e) {
    console.log(e);
  }
}

function updateProgress() {
  if (!media) {
    return;
  }
  var progress = document.getElementById('progress'), value = 0;

  media.getCurrentPosition(function (pos) {
    if (pos > 0) {
      value = Math.floor((1000 / media.getDuration()) * pos);
    }
    progress.value = value;
  });
}

function togglePlayPause(toPlayPause){
  var playBtn = document.getElementById('play');
  if( toPlayPause ){
    playPause = toPlayPause;
    playBtn.textContent = '||';
    console.log('Playing: ');
  }
  else {
    playPause = toPlayPause;
    playBtn.textContent = '|>';
    console.log('Pausing: ');
  }

}

function play() {
  console.log('play');
  recording = false;
  if (!playPause) {
    try {
      media.play();
      myinterval = setInterval(updateProgress, 100);
    } catch (e) {
      console.log('Error ' + e);
    }
  } else {
    try {
      media.pause();
      clearInterval(myinterval);
    } catch (e) {
      console.log('Error ' + e);
    }
  }
  togglePlayPause(!playPause);
}

function stop() {
  clearInterval(myinterval);
  if(!recording){
    media.stop();
    togglePlayPause(false);
  }
  else{
    stopRecAudio();
  }
}

function release() {
  media.release();
}

function getPos() {
  media.getCurrentPosition(function (pos) {
    console.log(pos);
  }, function (err) {
    console.log(err);
  });
}

function setPos(value) {
  var pos = value * media.getDuration() / 1000;
  console.log('setPos to ' + value + '*' + media.getDuration() + '/ 1000 = ' + pos);
  media.seekTo(pos * 1000);
}

function setVolume(value) {
  console.log('setVol: ' + volume);
  var volume = value / 10;
  media.setVolume(volume);
}

function recordAudio() {
  console.log('recordAudio');
  create();
  recording = true;
  media.startRecord();
}

function stopRecAudio() {
  console.log('stopRecord');
  getDirectoryContents('documents', function (files) {
    var i;
    for (i = 0; i < files.length; i++) {
      console.log(files[i].fullPath);
      if(!(files[i].name in playfiles) ){
        playfiles[files[i].name] =  files[i];
        table.row.add([i + '.', '/opt/usr/media/Documents/' + files[i].name]).draw(false);
      }
    }
  });
  media.stopRecord();
}

function getDirectoryContents(rootDirName, callback) {
  tizen.filesystem.resolve(
      rootDirName,
      function (dir) {
        dir.listFiles(
            function (fileArray) {
              if (fileArray.length > 0) {
                callback(fileArray);
              } else {
                console.log('Directory ' + dir.fullPath + ' is empty.', 'WARNING');
              }
            },
            function (e) {
              console.log(e.message, 'WARNING');
            }
        );
      },
      function (e) {
        console.log('Could not resolve the following virtual root: ' + rootDirName + 'WARNING');
        console.log('Error: ' + e.message, 'ERROR');
      },
      'r'
  );
}
