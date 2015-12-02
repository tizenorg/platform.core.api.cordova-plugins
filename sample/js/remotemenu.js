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

// a set of functions utilizing Tizen's TVInputDevice API.
// Made to enable controlling the application via remote control
// (especially important on TVs with disabled mouse support).
// Creates a global reference: window.stateController.
// @author: Adam Szczerbiak (a.szczerbiak@samsung.com)
// created: 2015-11-24
// last modified: 2015-11-30

// remote control initialization function is called here on boot:
// (@TODO) (@TODO_revised: not needed/?)
// not needed. All the submodules' init functions will now be called
// from main_init() method in main.js file.

var stateController = {};
stateController.NORMAL_BUTTONS_COUNT = 8;
stateController.TOTAL_BUTTONS_COUNT = stateController.NORMAL_BUTTONS_COUNT;
stateController.activeButtonNo = 0;

// a helper function returning the full ID of currently active button:
stateController.getActiveButtonID = function() {
  var btnNo, activeButtonID;
  btnNo = this.activeButtonNo;
  if (btnNo < this.NORMAL_BUTTONS_COUNT) {
    activeButtonID = 'btn' + btnNo;
  } else {
    // currently selected button is a special button.
    // these are numbered independently, starting from 0.
    // to get special button's ID one needs to substract
    // normal buttons count from current menu position:
    btnNo -= this.NORMAL_BUTTONS_COUNT;
    activeButtonID = 'btns' + btnNo;
  }
  return activeButtonID;
};

stateController.updateButtonsState = function() {
  var i, normalButtonID;
  // change the class of every "normal" button to "normal":
  if (this.NORMAL_BUTTONS_COUNT > 0) {
    for (i = 0; i < this.NORMAL_BUTTONS_COUNT; i++) {
      normalButtonID = 'btn' + i;
      document.getElementById(normalButtonID).className = 'normal';
      // logger.log('Set button id\'ed: ' + normalButtonID + ' to "normal".');
    }
  }

  /*
   * Decided to treat 'special colorful' buttons differently, they may not be
   * accessed from the menu. Press A/B/C/D buttons on remote controller to use
   * them. // change the class of every "special" button to "special":
   * if(this.SPECIAL_BUTTONS_COUNT > 0) { for(i = 0; i <
   * this.SPECIAL_BUTTONS_COUNT; i++) { specialButtonID = 'btns' + i;
   * document.getElementById(specialButtonID).className = 'special'; //
   * logger.log('set button id\'ed: ' + specialButtonID + ' to "special".'); } }
   */

  // change the class of currently active menu button to "active":
  document.getElementById(this.getActiveButtonID()).className = 'active';

  // logger.log('set button id\'ed: ' + activeButtonID + ' to "active".');
};

stateController.selectNextMenuItem = function() {
  // select next menu item:
  this.activeButtonNo += 1;

  // but keep it in range [0, TOTAL_BUTTONS_COUNT-1]:
  this.activeButtonNo %= this.TOTAL_BUTTONS_COUNT;

  // redraw the menu:
  this.updateButtonsState();

  // logger.log('Active button: ' + this.activeButtonNo);
};

stateController.selectPrevMenuItem = function() {
  // select previous menu item:
  // similar to "-=1", but allows for modular arithmetics:
  this.activeButtonNo += (this.TOTAL_BUTTONS_COUNT - 1);

  // but keep it in range [0, TOTAL_BUTTONS_COUNT-1]:
  this.activeButtonNo %= this.TOTAL_BUTTONS_COUNT;

  // redraw the menu:
  this.updateButtonsState();

  // logger.log('Active button: ' + this.activeButtonNo);
};

stateController.invokeActiveButtonAction = function() {
  var activeButtonID = this.getActiveButtonID();
  document.getElementById(activeButtonID).click();
};

stateController.invokeSpecialButtonAction = function(specialButtonID) {
  document.getElementById(specialButtonID).click();
};

// TizenTV remote control interface:
stateController.registerTizenRemoteKeys = function() {
  if (!tizen.tvinputdevice) {
    window.logger.log('This is not a TV, skipping remote support...');
    return;
  }

  window.logger.log('Adding a TV Remote support...');
  // these are not present on the emulator:
  // tizen.tvinputdevice.registerKey('Enter');
  // tizen.tvinputdevice.registerKey('Back');
  tizen.tvinputdevice.registerKey('ChannelUp');
  tizen.tvinputdevice.registerKey('ChannelDown');
  tizen.tvinputdevice.registerKey('ColorF0Red');
  tizen.tvinputdevice.registerKey('ColorF1Green');
  tizen.tvinputdevice.registerKey('ColorF2Yellow');
  tizen.tvinputdevice.registerKey('ColorF3Blue');
  window.addEventListener('keydown', function(keyEvent) {
    if (keyEvent.keyCode === 37) { // left arrow
      window.logger.log('ArrowLeft was pressed.');
    } else if (keyEvent.keyCode === 38) { // UP arrow
      stateController.selectPrevMenuItem();
    } else if (keyEvent.keyCode === 39) { // right arrow
      stateController.invokeActiveButtonAction();
    } else if (keyEvent.keyCode === 40) { // arrow down
      stateController.selectNextMenuItem();
    } else if (keyEvent.keyCode === 427) { // ChannelUp: keycode 427
      window.logger.log('Channel UP was pressed!');
      // no idea what to do with these... may come in handy later.
    } else if (keyEvent.keyCode === 428) { // ChannelDown: keycode 428
      window.logger.log('Channel DOWN was pressed!');
    }
    // please note that there is no ENTER key support on this tizenTV
    // else if(keyEvent.keyCode === 13) {
    // logger.log('ENTER key was pressed.');
    // }
    // else if(keyEvent.keyCode === 10009) {
    // log('BACK key was pressed.');
    // }
    else if (keyEvent.keyCode === 403) { // the red "A" button - keycode 403
      stateController.invokeSpecialButtonAction('btns0');
    } else if (keyEvent.keyCode === 404) { // the green "B" button - keycode
                                            // 404
      stateController.invokeSpecialButtonAction('btns1');
    } else if (keyEvent.keyCode === 405) { // the yellow "C" button, keycode
                                            // 405
      stateController.invokeSpecialButtonAction('btns2');
    } else if (keyEvent.keyCode === 406) { // the blue "D" button - keycode:
                                            // 406
      stateController.invokeSpecialButtonAction('btns3');
    }
  });

  window.logger.log('EventListener has been added.');
};

//////////////////////////////////////////////////////////////////////////////////////

// prints all the supported remote keys.
// @requires privilege http://tizen.org/privilege/tv.inputdevice
// post: a list of all supported remote keys is printed using SimpleLogger
// interface.
function printAllSupportedRemoteKeys() {
  var keyCodes, supportedKeys, i;
  keyCodes = {};
  supportedKeys = tizen.tvinputdevice.getSupportedKeys();
  if (supportedKeys.length > 0) {
    window.logger.log('The list of all supported remote keys ('
        + supportedKeys.length + '):');
    for (i = 0; i < supportedKeys.length; i++) {
      keyCodes[supportedKeys[i].name] = supportedKeys[i].code;
      window.logger.log(supportedKeys[i].name + ': ' + supportedKeys[i].code);
    }
    window.logger.log('--- End of supported remote keys list ---');
  } else {
    window.logger.log('No supported keys have been found.');
  }
}
//////////////////////////////////////////////////////////////////////////////////////
window.stateController = stateController;