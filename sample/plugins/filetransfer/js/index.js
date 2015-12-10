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

var imagePath = null;
var videoPath = null;
var serverURL = 'http://www.filedropper.com/';


var onProgressCB = function (progEvt) {
    document.getElementById('progress').innerHTML = Math.round((100 *progEvt.loaded / progEvt.total)) + '%';
    console.log(Math.round((100 * progEvt.loaded / progEvt.total)) + '%');
};


var downloadApp = function() {
}


downloadApp.prototype = {
  run: function(imageUri, videoUri, imageFileName, videoFileName, folderName) {
    var that = this,
      filePath = '';

    document.getElementById('imgOper').addEventListener('click', function() {
      if (imagePath) {  // upload
        that.uploadImg();
      } else {  // upload
        that.getFilesystem(
          function(fileSystem) {
            console.log('gotFS');
            var filePath;
            var urlPath = fileSystem.root.toURL();
            filePath = urlPath + '\/' + imageFileName;
            that.transferImage(imageUri, filePath)
          },
          function() {
            console.log('failed to get filesystem');
          }
        );
      }
    });

    document.getElementById('vidOper').addEventListener('click', function() {
      if (videoPath) {  // upload
        that.uploadVid();
      } else {  // upload
        that.getFilesystem(
          function(fileSystem) {
            console.log('gotFS');
            var filePath;
            var urlPath = fileSystem.root.toURL();
            filePath = urlPath + '\/' + videoFileName;
            that.transferVideo(videoUri, filePath)
          },
          function() {
            console.log('failed to get filesystem');
          }
        );
      }
    });

    document.getElementById('serverURL').addEventListener('click', function() {
      document.getElementById('result').innerHTML =
        '<div class="input-area"><input type="text" id="input_server_url" class="inputBox" placeholder="Server URL" value="' + serverURL + '"/></div>' +
        '<div><button class="button dh" id="set_server_url">Set Server URL</button></div>' +
        '<div><button class="button dh" id="cancel_server_url">Cancel</button></div>';
      document.getElementById('imgOper').disabled = true;
      document.getElementById('vidOper').disabled = true;
      document.getElementById('set_server_url').addEventListener('click', function() {
        serverURL = document.getElementById('input_server_url').value;
        document.getElementById('result').innerHTML = '';
        document.getElementById('imgOper').disabled = false;
        document.getElementById('vidOper').disabled = false;
        document.getElementById('downloaded').style.display = 'block';
      });
      document.getElementById('cancel_server_url').addEventListener('click', function() {
        document.getElementById('result').innerHTML = '';
        document.getElementById('imgOper').disabled = false;
        document.getElementById('vidOper').disabled = false;
        document.getElementById('downloaded').style.display = 'block';
      });
      document.getElementById('downloaded').style.display = 'none';
    });
  },

  getFilesystem:function (success, fail) {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
  },

  getFolder: function (fileSystem, folderName, success, fail) {
    fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
  },

  transferImage: function (uri, filePath) {
    var transfer = new FileTransfer();
    transfer.onprogress = onProgressCB;
    transfer.download(
      uri,
      filePath,
      function(entry) {
        imagePath = entry.toURL();

        document.getElementById('downloaded').innerHTML = '<img id="downloadedContent"/>';
        var image = document.getElementById('downloadedContent');
        image.src = imagePath;
        image.style.display = 'block';
        image.display = imagePath;

        document.getElementById('progress').innerHTML = '';
        document.getElementById('result').innerHTML = 'File saved to: ' + imagePath;
        document.getElementById('imgOper').innerHTML = 'Upload image';
      },
      function(error) {
        document.getElementById('result').innerHTML = 'An error has occurred: Code = ' + error.code;
        console.log('download error source ' + error.source);
        console.log('download error target ' + error.target);
        console.log('upload error code ' + error.code);
      }
      );
  },

  transferVideo: function (uri, filePath) {
    var transfer = new FileTransfer();
    transfer.onprogress = onProgressCB;
    transfer.download(
      uri,
      filePath,
      function(entry) {
        videoPath = entry.toURL();
        document.getElementById('downloaded').innerHTML = '<video id="downloadedContent" src="' + videoPath + '" controls></video>';

        document.getElementById('progress').innerHTML = '';
        document.getElementById('result').innerHTML = 'File saved to: ' + videoPath;
        document.getElementById('vidOper').innerHTML = 'Upload video';
      },
      function(error) {
        document.getElementById('result').innerHTML = 'An error has occurred: Code = ' + error.code;
        console.log('download error source ' + error.source);
        console.log('download error target ' + error.target);
        console.log('upload error code ' + error.code);
      }
      );
  },

  uploadImg: function() {
     var options = new FileUploadOptions();
     options.fileKey = 'file';
     options.fileName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
     options.mimeType = 'image/png';
     options.params = {}; // if we need to send parameters to the server request
     options.headers = {
       Connection: 'Close'
     };
     options.chunkedMode = false;

     var ft = new FileTransfer();
    ft.onprogress = onProgressCB;
     ft.upload(
       imagePath,
       encodeURI(serverURL),
       onFileUploadSuccess,
       onFileTransferFail,
       options);

     function onFileUploadSuccess (result) {
       console.log('FileTransfer.upload');
       console.log('Code = ' + result.responseCode);
       console.log('Response = ' + result.response);
       console.log('Sent = ' + result.bytesSent);
       console.log('Link to uploaded file: ' + serverURL + result.response);
       var response = result.response;

       var destination = serverURL + response.substr(response.lastIndexOf('=') + 1);

       document.getElementById('result').innerHTML = 'File uploaded to: ' +
                               destination +
                               "</br><button onclick=\"window.open('" + destination + "', '_blank', 'location=yes')\">Open Location</button>";
     }

     function onFileTransferFail (error) {
       console.log('FileTransfer Error:');
       console.log('Code: ' + error.code);
       console.log('Source: ' + error.source);
       console.log('Target: ' + error.target);
     }
  },
  uploadVid: function() {
     var options = new FileUploadOptions();
     options.fileKey = 'file';
     options.fileName = videoPath.substr(videoPath.lastIndexOf('/') + 1);
     options.mimeType = "video/3gpp";
     options.params = {}; // if we need to send parameters to the server request
     options.headers = {
       Connection: 'Close'
     };
     options.chunkedMode = false;

     var ft = new FileTransfer();
    ft.onprogress = onProgressCB;
     ft.upload(
       videoPath,
       encodeURI(serverURL),
       onFileUploadSuccess,
       onFileTransferFail,
       options);

     function onFileUploadSuccess (result) {
       console.log('FileTransfer.upload');
       console.log('Code = ' + result.responseCode);
       console.log('Response = ' + result.response);
       console.log('Sent = ' + result.bytesSent);
       console.log('Link to uploaded file: ' + serverURL + result.response);
       var response = result.response;

       var destination = serverURL + response.substr(response.lastIndexOf('=') + 1);

       document.getElementById('result').innerHTML = 'File uploaded to: ' +
                               destination +
                               "</br><button onclick=\"window.open('" + destination + "', '_blank', 'location=yes')\">Open Location</button>";
     }

     function onFileTransferFail (error) {
       console.log('FileTransfer Error:');
       console.log('Code: ' + error.code);
       console.log('Source: ' + error.source);
       console.log('Target: ' + error.target);
     }
  }
}


function onDeviceReady() {
  document.addEventListener('backbutton', function() {
    window.history.back();
  });
  var that = this,
    App = new downloadApp(),
    imageFileName = 'sample.png',
    videoFileName = 'sample.3gp',
    imageUri = encodeURI('http://demo.joomlaworks.net/images/stories/demo/walkman/DSC00009.JPG'),
    videoUri = encodeURI('http://www.sample-videos.com/video/3gp/240/big_buck_bunny_240p_1mb.3gp'),
    folderName = 'test';

  //navigator.splashscreen.hide();
  App.run(imageUri, videoUri, imageFileName, videoFileName, folderName);
}


//Initialize function
var init = function () {
  document.addEventListener('deviceready', onDeviceReady, false);
};

window.onload = init;
