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
  var uriPrefix = 'file://';

  function stripTrailingSlash(str) {
    if ('/' === str.substr(-1)) {
      return str.substr(0, str.length - 1);
    }
    return str;
  }

  function getName(uri) {
    return stripTrailingSlash(uri).replace(/^.*(\\|\/|\:)/, '');
  }

  function getFullPath(uri) {
    if (0 === uri.indexOf(uriPrefix)) {
      uri = uri.substr(uriPrefix.length);
    }
    return stripTrailingSlash(uri);
  }

  function getNativeUrl(uri) {
    return stripTrailingSlash(uri);
  }

  function createEntry(file, fsName) {
    var uri = file.toURI();
    return {
      name: getName(uri),
      fullPath: getFullPath(uri),
      nativeURL: getNativeUrl(uri),
      filesystemName: fsName
    };
  }

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

  var rootDirUri = 'file:///';

  var roots = [
    {
      filesystemName: 'root',
      name: getName(rootDirUri),
      fullPath: getFullPath(rootDirUri),
      nativeURL: getNativeUrl(rootDirUri)
    }
  ];

  function getRoots(successCallback) {
    if (roots_to_resolve.length > 0) {
      tizen.filesystem.resolve(roots_to_resolve[0].nativeURL, function(dir) {
        roots_to_resolve[0] = createEntry(dir, roots_to_resolve[0].filesystemName);
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

  function findFilesystem(uri) {
    var fullPath = getFullPath(uri);
    for (var i = roots.length - 1; i > 0; --i) {
      if (0 === strncmp(fullPath, roots[i].fullPath, roots[i].fullPath.length)) {
        return roots[i];
      }
    }

    return roots[0];  // root filesystem
  }

  function isRootUri(uri) {
    var fs = findFilesystem(uri);
    return (fs.fullPath === getFullPath(uri));
  }

  return {
    getRoots: getRoots,
    findFilesystem: findFilesystem,
    getName: getName,
    getFullPath: getFullPath,
    getNativeUrl: getNativeUrl,
    stripTrailingSlash: stripTrailingSlash,
    createEntry: createEntry,
    isRootUri: isRootUri
  };
})();
