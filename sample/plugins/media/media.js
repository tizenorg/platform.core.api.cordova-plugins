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

var deviceReady = function() {
  window.logger.log('Device ready');
};

var init = function () {
  window.logger.log('Media window loaded');
  document.addEventListener('deviceready', deviceReady, true);
  window.logger.log('Listener device ready added');
};

window.onload = init;

$(document).ready(function() {
    table = $('#example').DataTable({
        select: 'single',
        bLengthChange: false,
        paging: true,
        searching: false,
        info: false,
        scrollY:     100,
        scroller:    true
    });
    
    table.on( 'select', function ( e, dt, type, indexes ) {
        if ( type === 'row' ) {
            //var data = table.row( indexes ).data().pluck( 'id' );
            //window.logger.log(table.row(indexes).data()[1]);
            document.getElementById('inputFile').value = table.row(indexes).data()[1];
            if(media!=null){
                release();
            }
            create();
            lastIndex = table.row(indexes).data()[0].split("")[0];
            window.logger.log("last index " + lastIndex);
        }
    });
    
    table.on('added', function(){
        window.logger.log("dupa");
    });
} );

var success = function() {
  window.logger.log('succes');
};

var error = function(e) {
  window.logger.log(e);
};

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
    console.log('Get current position success 1000 / ' + media.getDuration() + " * "
        + pos);
    if (pos > 0) {
      value = Math.floor((1000 / media.getDuration()) * pos);
    }
    progress.value = value;
    window.logger.log('width: ' + progress.value);
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
      clearInterval(myinterval);
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

function setPos(value) {
  //var pos = document.getElementById('setPosValue').value;
  clearInterval(myinterval);
  //value = Math.floor((1000 / media.getDuration()) * pos);  
  var pos = value * media.getDuration() / 1000;
  console.log('setPos to ' + value + "*" + media.getDuration() + "/ 1000 = " + pos );
  media.seekTo(pos*1000);
  myinterval = setInterval(updateProgress, 100);
}

function setVolume(value) {
  window.logger.log('setVol: ' + volume);
  var volume = value / 10;
  media.setVolume(volume);
}

function recordAudio() {
  window.logger.log('recordAudio');
  create();
  table.row.add([ '2.', media.src ]).draw(false);
  //media.startRecord();
}

function stopRecAudio() {
  window.logger.log('stopRecord');
  media.stopRecord();
}
