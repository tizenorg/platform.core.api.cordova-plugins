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

/**
 * This class contains information about any Media errors
*/
/*
 According to :: http://dev.w3.org/html5/spec-author-view/video.html#mediaerror
 We should never be creating these objects, we should just implement the interface
 which has 1 property for an instance, 'code'

 instead of doing :
    errorCallbackFunction( new MediaError(3,'msg') );
we should simply use a literal :
    errorCallbackFunction( {'code':3} );
 */

 var _MediaError = window.MediaError;


if(!_MediaError) {
    window.MediaError = _MediaError = function(code, msg) {
        this.code = (typeof code != 'undefined') ? code : null;
        this.message = msg || ""; // message is NON-standard! do not use!
    };
}

_MediaError.MEDIA_ERR_NONE_ACTIVE    = _MediaError.MEDIA_ERR_NONE_ACTIVE    || 0;
_MediaError.MEDIA_ERR_ABORTED        = _MediaError.MEDIA_ERR_ABORTED        || 1;
_MediaError.MEDIA_ERR_NETWORK        = _MediaError.MEDIA_ERR_NETWORK        || 2;
_MediaError.MEDIA_ERR_DECODE         = _MediaError.MEDIA_ERR_DECODE         || 3;
_MediaError.MEDIA_ERR_NONE_SUPPORTED = _MediaError.MEDIA_ERR_NONE_SUPPORTED || 4;
// TODO: MediaError.MEDIA_ERR_NONE_SUPPORTED is legacy, the W3 spec now defines it as below.
// as defined by http://dev.w3.org/html5/spec-author-view/video.html#error-codes
_MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED = _MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || 4;

MediaError = _MediaError;

var audioObjects = {};
var mediaObjects = {};



function create(args) {
    var id = args[0], src = args[1];

    console.log("media::create() - id =" + id + ", src =" + src);

    audioObjects[id] = new Audio(src);

    audioObjects[id].onStalledCB = function () {
        console.log("media::onStalled()");

        audioObjects[id].timer = window.setTimeout(
            function () {
                audioObjects[id].pause();

                if (audioObjects[id].currentTime !== 0)
                    audioObjects[id].currentTime = 0;

                console.log("media::onStalled() - MEDIA_ERROR -> " + MediaError.MEDIA_ERR_ABORTED);

                var err = new MediaError(MediaError.MEDIA_ERR_ABORTED, "Stalled");

                Media.onStatus(id, Media.MEDIA_ERROR, err);
        }, 2000);
    };
    
    audioObjects[id].onEndedCB = function () {
        console.log("media::onEndedCB() - MEDIA_STATE -> MEDIA_STOPPED");

        Media.onStatus(id, Media.MEDIA_STATE, Media.MEDIA_STOPPED);
    };

    audioObjects[id].onErrorCB = function () {
        console.log("media::onErrorCB() - MEDIA_ERROR -> " + event.srcElement.error);

        Media.onStatus(id, Media.MEDIA_ERROR, event.srcElement.error);
    };

    audioObjects[id].onPlayCB = function () {
        console.log("media::onPlayCB() - MEDIA_STATE -> MEDIA_STARTING");

        Media.onStatus(id, Media.MEDIA_STATE, Media.MEDIA_STARTING);
    };

    audioObjects[id].onPlayingCB = function () {
        console.log("media::onPlayingCB() - MEDIA_STATE -> MEDIA_RUNNING");

        Media.onStatus(id, Media.MEDIA_STATE, Media.MEDIA_RUNNING);
    };

    audioObjects[id].onDurationChangeCB = function () {
        console.log("media::onDurationChangeCB() - MEDIA_DURATION -> " +  audioObjects[id].duration);

        Media.onStatus(id, Media.MEDIA_DURATION, audioObjects[id].duration);
    };

    audioObjects[id].onTimeUpdateCB = function () {
        console.log("media::onTimeUpdateCB() - MEDIA_POSITION -> " +  audioObjects[id].currentTime);

        Media.onStatus(id, Media.MEDIA_POSITION, audioObjects[id].currentTime);
    };

    audioObjects[id].onCanPlayCB = function () {
        console.log("media::onCanPlayCB()");

        window.clearTimeout(audioObjects[id].timer);

        audioObjects[id].play();
    };
}

function Media(src, mediaSuccess, mediaError, mediaStatus) {
    this.src = src;
    this.id = utils.createUUID();
    this.mediaSuccess = mediaSuccess;
    this.mediaError = mediaError;
    this.mediaStatus = mediaStatus;
    this._duration = -1;
    this._position = -1;
    mediaObjects[this.id] = this;
    create([this.id, this.src])
}

/**
 * Audio has status update.
 * PRIVATE
 *
 * @param id            The media object id (string)
 * @param msgType       The 'type' of update this is
 * @param value         Use of value is determined by the msgType
 */
Media.onStatus = function(id, msgType, value) {

    var media = mediaObjects[id];

    if(media) {
        switch(msgType) {
            case Media.MEDIA_STATE :
                media.statusCallback && media.statusCallback(value);
                if(value == Media.MEDIA_STOPPED) {
                    media.successCallback && media.successCallback();
                }
                break;
            case Media.MEDIA_DURATION :
                media._duration = value;
                break;
            case Media.MEDIA_ERROR :
                media.errorCallback && media.errorCallback(value);
                break;
            case Media.MEDIA_POSITION :
                media._position = Number(value);
                break;
            default :
                console.error && console.error("Unhandled Media.onStatus :: " + msgType);
                break;
        }
    }
    else {
         console.error && console.error("Received Media.onStatus callback for unknown media :: " + id);
    }

};

Media.prototype.getCurrentPosition = function(mediaSuccess, mediaError){}

Media.prototype.getDuration = function(){};

Media.prototype.pause = function(){};

Media.prototype.play = function(){
    var id = this.id, src = this.src;

    console.log("media::startPlayingAudio() - id =" + id + ", src =" + src);

    audioObjects[id].addEventListener('canplay', audioObjects[id].onCanPlayCB);
    audioObjects[id].addEventListener('ended', audioObjects[id].onEndedCB);
    audioObjects[id].addEventListener('timeupdate', audioObjects[id].onTimeUpdateCB);
    audioObjects[id].addEventListener('durationchange', audioObjects[id].onDurationChangeCB);
    audioObjects[id].addEventListener('playing', audioObjects[id].onPlayingCB);
    audioObjects[id].addEventListener('play', audioObjects[id].onPlayCB);
    audioObjects[id].addEventListener('error', audioObjects[id].onErrorCB);
    audioObjects[id].addEventListener('stalled', audioObjects[id].onStalledCB);

    audioObjects[id].play();
    
};

Media.prototype.release = function(){};

Media.prototype.seekTo = function(miliseconds){};

Media.prototype.setVolume = function(volume){};

Media.prototype.startRecord = function(){};

Media.prototype.stop = function(){};

Media.prototype.stopRecord = function(){};

_global.Media = Media;

console.log('Loaded cordova.device API');

exports = function(require) {
};
