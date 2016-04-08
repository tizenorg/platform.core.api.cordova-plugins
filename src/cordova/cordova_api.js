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

console.log('Loaded cordova API');

exports = {
  load: function(require) {
    // delete this method
    delete exports.load;

    var plugins = [];

    // mechanism to add Tizen-specific plugins to cordova
    cordova.define('cordova-tizen', function(require, exports, module) {
      module.exports = {
        addPlugin: function(dependency, name, algorithm, symbol) {
          plugins.push({
            dependency: dependency,
            name: name,
            algorithm: algorithm,
            symbol: symbol
          });
        }
      };
    });

    var channel = require('cordova/channel');

    // executed when all cordova plugins have been loaded
    channel.onPluginsReady.subscribe(function() {
      var mm = require('cordova/modulemapper');

      // add plugins to module mapper, but only if they are required
      // (their dependencies have been defined/loaded)
      for (var i = 0; i < plugins.length; ++i) {
        var p = plugins[i];
        if (cordova.define.moduleMap[p.dependency]) {
          mm[p.algorithm](p.name, p.symbol);
        }
      }
    });

    // load file native plugin
    tizen.cordova.file(require);
  }
};
