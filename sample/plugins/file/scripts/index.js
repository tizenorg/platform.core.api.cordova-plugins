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

var currentScreen = 'file';
var dirName = null;
var fileName = null;
var copyName = null;

var opr = {
  DIR_CREATED: 1,
  DIR_DELETED: 2,
  FILE_CREATED: 3,
  FILE_DELETED: 4
};

var onError = function(err) {
  alert('Error: ' + err.message);
};


var changeScreen = function (screen) {
  // Change content
  document.getElementById('content_' + currentScreen).style.display = 'none';
  document.getElementById('content_' + screen).style.display = 'block';

  currentScreen = screen;

  // Change header
  if (screen === 'create_dir') {
    document.getElementById('header_el').innerHTML = '<h1>File - create directory</h1>';
  } else if (screen === 'write_file') {
    document.getElementById('header_el').innerHTML = '<h1>File - write to file</h1>';
  } else if (screen === 'read_file') {
    document.getElementById('header_el').innerHTML = '<h1>File - read file</h1>';
  } else if (screen === 'copy_file') {
    document.getElementById('header_el').innerHTML = '<h1>File - copy file</h1>';
  } else if (screen === 'move_file') {
    document.getElementById('header_el').innerHTML = '<h1>File - move file</h1>';
  } else if (screen === 'file') {
    document.getElementById('header_el').innerHTML = '<h1>File Sample</h1>';
  }
};


var updateButtons = function(oper) {
  switch (oper) {
    case opr.DIR_CREATED:
      document.getElementById('createDir').disabled = true;
      document.getElementById('removeDir').disabled = false;
      document.getElementById('writeToFile').disabled = false;
      document.getElementById('readFile').disabled = true;
      document.getElementById('copyFile').disabled = true;
      document.getElementById('moveFile').disabled = true;
      document.getElementById('removeFile').disabled = true;
      break;

    case opr.DIR_DELETED:
      document.getElementById('createDir').disabled = false;
      document.getElementById('removeDir').disabled = true;
      document.getElementById('writeToFile').disabled = true;
      document.getElementById('readFile').disabled = true;
      document.getElementById('copyFile').disabled = true;
      document.getElementById('moveFile').disabled = true;
      document.getElementById('removeFile').disabled = true;
      break;

    case opr.FILE_CREATED:
      document.getElementById('writeToFile').disabled = true;
      document.getElementById('readFile').disabled = false;
      document.getElementById('copyFile').disabled = false;
      document.getElementById('moveFile').disabled = false;
      document.getElementById('removeFile').disabled = false;
      break;

    case opr.FILE_DELETED:
      document.getElementById('writeToFile').disabled = false;
      document.getElementById('readFile').disabled = true;
      document.getElementById('copyFile').disabled = true;
      document.getElementById('moveFile').disabled = true;
      document.getElementById('removeFile').disabled = true;
      break;
  }
};


var setFileName = function(class_name, file_name) {
  var elements = document.getElementsByClassName(class_name);
  var i;
  for (i = 0; i < elements.length; i++) {
    elements[i].innerHTML = file_name;
  }
};


var App = function() {
}


App.prototype = {
  run: function() {
    var that = this;
    document.getElementById('persistStor').addEventListener('click', that.persistStor);
    document.getElementById('tmpStor').addEventListener('click', that.tmpStor);
    document.getElementById('createDir').addEventListener('click', function() {
      changeScreen('create_dir');
    });
    document.getElementById('writeToFile').addEventListener('click', function() {
      changeScreen('write_file');
    });
    document.getElementById('do_write_file').addEventListener('click', that.writeFile);
    document.getElementById('readFile').addEventListener('click', function() {
      that.readFile();
      changeScreen('read_file');
    });
    document.getElementById('copyFile').addEventListener('click', function() {
      changeScreen('copy_file');
    });
    document.getElementById('do_copy_file').addEventListener('click', that.copyFile);
    document.getElementById('moveFile').addEventListener('click', function() {
      changeScreen('move_file');
    });
    document.getElementById('do_move_file').addEventListener('click', that.moveFile);
    document.getElementById('removeFile').addEventListener('click', that.removeFile);
    document.getElementById('do_create_dir').addEventListener('click', that.createDir);
    document.getElementById('removeDir').addEventListener('click', that.removeDir);
  },
  persistStor: function() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
      function(fileSystem) {
        alert('Requesting persistent file system succeded');
      },
      function(error) {
        error.message = "Requesting persistent file system failed.";
        onError.call(that, error);
      });
  },
  tmpStor: function() {
    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0,
      function(fileSystem) {
        alert('Requesting temporary file system succeded');
      },
      function(error) {
        error.message = "Requesting temporary file system failed.";
        onError.call(that, error);
      });
  },
  createDir: function() {
    dirName = document.getElementById("dir_name").value;

    if (dirName === '' || /[^A-Za-z0-9_\.]/.test(dirName)) {
      dirName = null;
      onError({ message: 'Wrong directory name !' });
      return;
    }

    resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dataDirEntry) {
      dataDirEntry.getDirectory(
        dirName,
        { create: true, exclusive: false },
        function (dirEntry) {
          alert('Directory ' + dirName + ' created');
          updateButtons(opr.DIR_CREATED);
          document.getElementById('dirNameView').innerHTML = dirName;
          document.getElementById('dirNameBlock').style.display = 'block';
          changeScreen('file');
        }, function (e) {
          onError({ message: 'Cannot create directory (' + e.code + ')' });
        });
    }, function (e) {
      onError({ message: 'Cannot create directory (' + e.code + ')' });
    });
  },
  removeDir: function() {
    resolveLocalFileSystemURL(cordova.file.dataDirectory + dirName, function (dirEntry) {
      dirEntry.removeRecursively(
        function () {
          alert('Directory ' + dirName + ' deleted');
          updateButtons(opr.DIR_DELETED);
          document.getElementById('dirNameView').innerHTML = '';
          setFileName('fileNameView', '');
          setFileName('copyNameView', '');
          document.getElementById('dirNameBlock').style.display = 'none';
          document.getElementById('fileNameBlock').style.display = 'none';
          document.getElementById('copyNameBlock').style.display = 'none';
          dirName = null;
          fileName = null;
          copyName = null;
          changeScreen('file');
        }, function (e) {
          onError({ message: 'Cannot create directory (' + e.code + ')' });
        });
    }, function (e) {
      onError({ message: 'Cannot delete directory (' + e.code + ')' });
    });
  },
  writeFile: function() {
    fileName = document.getElementById("file_name").value;

    if (fileName === '' || /[^A-Za-z0-9_\.]/.test(fileName)) {
      fileName = null;
      onError({ message: 'Wrong file name !' });
      return;
    }

    resolveLocalFileSystemURL(cordova.file.dataDirectory + dirName, function (dataDirEntry) {
      dataDirEntry.getFile(
        fileName,
        { create: true, exclusive: false },
        function (fileEntry) {
          fileEntry.createWriter(
            function (writer) {
              writer.onwrite = function () {
                alert('File ' + fileName + ' created');
                updateButtons(opr.FILE_CREATED);
                setFileName('fileNameView', fileName);
                document.getElementById('fileNameBlock').style.display = 'block';
                changeScreen('file');
              };
              writer.onerror = function() {
                onError({ message: 'Failed to write data to a file' });
              };
              writer.write(document.getElementById('file_content').value);
            }, function (e) {
              onError({ message: 'Cannot create a file (' + e.code + ')' });
            }
          );
        }, function (e) {
          onError({ message: 'Cannot create a file (' + e.code + ')' });
        });
    }, function (e) {
      onError({ message: 'Cannot create directory (' + e.code + ')' });
    });
  },
  copyFile: function() {
    copyName = document.getElementById("copy_name").value;

    if (copyName === '' || /[^A-Za-z0-9_\.]/.test(copyName)) {
      copyName = null;
      onError({ message: 'Wrong target file name !' });
      return;
    }

    if (copyName === fileName) {
      copyName = null;
      onError({ message: 'Target file name has to differ from source file name !' });
      return;
    }

    resolveLocalFileSystemURL(cordova.file.dataDirectory + dirName + '/' + fileName, function (fileEntry) {
      fileEntry.getParent(
        function(parentEntry) {
          fileEntry.copyTo(
            parentEntry,
            copyName,
            function() {
                alert('File ' + fileName + ' copied into ' + copyName);
                setFileName('copyNameView', copyName);
                document.getElementById('copyNameBlock').style.display = 'block';
                changeScreen('file');
            }, function (e) {
              onError({ message: 'Cannot copy a file (' + e.code + ')' });
            });
        }, function (e) {
          onError({ message: 'Cannot copy a file (' + e.code + ')' });
        });
    }, function (e) {
      onError({ message: 'Cannot copy a file (' + e.code + ')' });
    });
  },
  moveFile: function() {
    var newFileName = document.getElementById("move_name").value;

    if (newFileName === '' || /[^A-Za-z0-9_\.]/.test(newFileName)) {
      onError({ message: 'Wrong targer file name !' });
      return;
    }

    if (newFileName === fileName) {
      onError({ message: 'Target file name has to differ from source file name !' });
      return;
    }

    resolveLocalFileSystemURL(cordova.file.dataDirectory + dirName + '/' + fileName, function (fileEntry) {
      fileEntry.getParent(
        function(parentEntry) {
          fileEntry.moveTo(
            parentEntry,
            newFileName,
            function() {
                alert('File ' + fileName + ' moved into ' + newFileName);
                fileName = newFileName;
                setFileName('fileNameView', fileName);
                changeScreen('file');
            }, function (e) {
              onError({ message: 'Cannot move a file (' + e.code + ')' });
            });
        }, function (e) {
          onError({ message: 'Cannot move a file (' + e.code + ')' });
        });
    }, function (e) {
      onError({ message: 'Cannot move a file (' + e.code + ')' });
    });
  },
  readFile: function() {
    resolveLocalFileSystemURL(cordova.file.dataDirectory + dirName + '/' + fileName, function (fileEntry) {
      fileEntry.file(
        function (file) {
          var reader = new FileReader();
          reader.onloadend = function (evt) {
            document.getElementById('file_content_view').innerHTML = evt.target.result;
            if (copyName) {
              document.getElementById('file_copy_read').style.display = 'block';
              resolveLocalFileSystemURL(cordova.file.dataDirectory + dirName + '/' + copyName, function (fileEntry) {
                fileEntry.file(
                  function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                      document.getElementById('copy_content_view').innerHTML = evt.target.result;
                    };
                    reader.readAsText(file);
                  }, function (e) {
                    onError({ message: 'Cannot read a file (' + e.code + ')' });
                  });
              }, function (e) {
                onError({ message: 'Cannot read a file (' + e.code + ')' });
              });
            }
          };
          reader.readAsText(file);
        }, function (e) {
          onError({ message: 'Cannot read a file (' + e.code + ')' });
        });
    }, function (e) {
      onError({ message: 'Cannot read a file (' + e.code + ')' });
    });

  },
  removeFile: function() {
    resolveLocalFileSystemURL(cordova.file.dataDirectory + dirName + '/' + fileName, function (fileEntry) {
      fileEntry.remove(
        function() {
          updateButtons(opr.FILE_DELETED);
          setFileName('fileNameView', '');
          document.getElementById('fileNameBlock').style.display = 'none';
          alert('File ' + fileName + ' deleted');
          fileName = null;

          if (copyName) {
            resolveLocalFileSystemURL(cordova.file.dataDirectory + dirName + '/' + copyName, function (fileEntry) {
              fileEntry.remove(
                function() {
                  setFileName('copyNameView', '');
                  document.getElementById('copyNameBlock').style.display = 'none';
                  alert('Copy file ' + copyName + ' deleted');
                  copyName = null;
                }, function(e) {
                  onError({ message: 'Cannot delete a copy file (' + e.code + ')' });
                }
              );
            }, function (e) {
              onError({ message: 'Cannot delete a copy file (' + e.code + ')' });
            });
          }
        }, function(e) {
          onError({ message: 'Cannot delete a file (' + e.code + ')' });
        }
      );
    }, function (e) {
      onError({ message: 'Cannot delete a file (' + e.code + ')' });
    });
  }
};


// onDeviceReady callback
function onDeviceReady() {
  var app = new App();
  app.run();
  document.addEventListener('backbutton', function() {
    if (currentScreen === 'file') {
      window.history.back();
    } else {
      changeScreen('file');
    }
  });
}


//Initialize function
var init = function () {
  document.addEventListener('deviceready', onDeviceReady, false);
};

window.onload = init;
