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

var rootsUtils = (function() {
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
      fullPath: '/',
      nativeURL: '/'
    }
  ];

  function getRoots(successCallback) {
    if (roots_to_resolve.length > 0) {
      tizen.filesystem.resolve(roots_to_resolve[0].nativeURL, function(dir) {
        roots_to_resolve[0].fullPath = dir.toURI().substr(7);
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

  function strncmp(str1, str2, n) {
    str1 = str1.substring(0, n);
    str2 = str2.substring(0, n);
    return ((str1 === str2) ? 0 : ((str1 > str2) ? 1 : -1 ));
  }

  function findFilesystem(url) {
    for (var i = roots.length - 1; i >= 0; i--) {
      if (url.indexOf('file://') == 0) {
        url = url.substr(7);
      }

      if (url.charAt(0) == '/') {
        if (url == roots[i].fullPath) {
          return roots[i];
        }

        if (strncmp(url, roots[i].fullPath + '/', roots[i].fullPath.length + 1) == 0) {
          return roots[i];
        }
      } else {
        if (url == roots[i].nativeURL) {
          return roots[i];
        }
      }
    }

    return roots[0];  // root filesystem
  }

  return {
    getRoots: getRoots,
    findFilesystem: findFilesystem
  };
})();
