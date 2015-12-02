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

// a subsystem enabling dynamically changing CSS file with colours definitions.
// its set of functions enable to either toggle through a predefined list of CSS files
// or load an arbitrarily chosen one directly.
// Creates a global reference: window.styleChooser.

// @author: Adam Szczerbiak (a.szczerbiak@samsung.com)
// created: 2015-11-30
// last modified: 2015-11-30

var styleChooser = {};
styleChooser.STYLES = ['css/colors.css', 'css/colors_night.css'];
styleChooser.STYLES_COUNT = styleChooser.STYLES.length;
styleChooser.current = 0;
styleChooser.debugLevel = 0; // set this to 1 to enable debug info outputting.

// a function to change the CSS stylesheet with colour definitions.
// it enables changing the "look and feel" of the application.
// pre: cssFileName is a valid, existing css file name
// given as either an absolute or relative to index.html path.
// post: instead of colors.css, the file provided as an argument gets loaded
// dynamically.
styleChooser.changeCSS = function(cssFileName) {
  var oldLink, newLink;

  // whenever the debug info is needed:
  if (this.debugLevel > 0) {
    window.logger.log('styleChooser.changeCSS(' + cssFileName
        + ') has been called.');
  }

  oldLink = document.getElementsByTagName('link').item(1);

  /*
   * // this function prints all the document's CSS files. // use this to
   * determine the index of "colors.css" file if needed. for(var i = 0; i <
   * oldLink.length; i++) { window.logger.log(oldLink.item(i).href); }
   */

  newLink = document.createElement('link');
  newLink.setAttribute('REL', 'STYLESHEET');
  newLink.setAttribute('type', 'text/css');
  newLink.setAttribute('href', cssFileName);

  document.getElementsByTagName('head').item(0).replaceChild(newLink, oldLink);

  if (this.debugLevel > 0) {
    window.logger.log('CSS style: ' + cssFileName
        + ' has been set successfully.');
  }
};

// a method to select next style from a list of predefined CSS files.
// post: next CSS style from a list (this.STYLES) is loaded dynamically into
// index.html's <head> section,
// inner variables (namely this.current) are updated to reflect the new state.
styleChooser.setNextStyle = function() {
  var nextStyleIndex;

  if (this.debugLevel > 0) {
    // inform the user about this action (debug info):
    window.logger.log('styleChooser.setNextStyle() has been called.');
  }

  // set styleChooser.current to next style from the list:
  nextStyleIndex = (this.current + 1) % this.STYLES_COUNT;

  // update index.html's head to reflect this change:
  this.changeCSS(this.STYLES[nextStyleIndex]);
  this.current = nextStyleIndex;
};

///////////////////////////////////////////////////////////////////////////////////////////////////

// make the reference to this object global, so that it may be accessed from
// other units:
window.styleChooser = styleChooser;