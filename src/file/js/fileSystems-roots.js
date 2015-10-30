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

// TODO: remove when added to public cordova repository -> begin
cordova.define('cordova-plugin-file.tizen.fileSystems-roots', function(require, exports, module) {
// TODO: remove -> end

var info = (function() {
  var roots_to_resolve = [
    {
      filesystemName: 'temporary',
      name: '',
      fullPath: '',
      nativeURL: 'wgt-private-tmp'
    },
    {
      filesystemName: 'persistent',
      name: '',
      fullPath: '',
      nativeURL: 'wgt-private'
    }
  ];

  var roots = [
    {
      filesystemName: 'root',
      name: '',
      fullPath: 'file:///',
      nativeURL: '/'
    }
  ];

  function getRoots(successCallback) {
    if (roots_to_resolve.length > 0) {
      tizen.filesystem.resolve(roots_to_resolve[0].nativeURL, function(dir) {
        roots_to_resolve[0].fullPath = dir.toURI();
        roots_to_resolve[0].name = roots_to_resolve[0].fullPath.replace(/^.*(\\|\/|\:)/, '');  // extract name of the directory
        roots.push(roots_to_resolve[0]);
        roots_to_resolve.splice(0, 1); // remove first item

        // we've resolved one root, check if there are any other
        getRoots(successCallback);
      }, function(e) {
        console.error(e);
        // in case of an error, return the roots we have so far
        successCallback(roots);
      });
    } else {
      successCallback(roots.slice());
    }
  }

  return {
    getRoots: getRoots
  };
})();

module.exports = {
    requestAllFileSystems: function(successCallback, errorCallback, args) {
      info.getRoots(successCallback);
  }
};

//TODO: remove when added to public cordova repository -> begin
});
//TODO: remove -> end
