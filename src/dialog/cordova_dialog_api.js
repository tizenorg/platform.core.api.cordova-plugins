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

var _navigator = navigator || {};
var _document = document || {};

var playback = (function() {
  var soundElement;
  var counter = 1;

  tizen.systemsetting.getProperty("NOTIFICATION_EMAIL", function(v) {
    soundElement = new Audio(v);
    soundElement.addEventListener('ended', function() {
      if (--counter > 0) {
        soundElement.play();
      }
    });
  }, function(e) {
    console.error('Failed to get the notification sound: ' + e);
  });

  function beep(times) {
    counter = times || 1;
    if (soundElement) {
      soundElement.play();
    }
  }

  return {
    beep: beep
  }
})();

var popup = (function () {
  var boxId = 'cordova-modal-box';
  var overlayId = 'cordova-modal-overlay';
  var popupId = 'cordova-modal-popup';
  var buttonIdPrefix = 'cordova-modal-popup-button-';
  var inputId = 'cordova-modal-popup-input';
  var d = _document;
  var sheet;
  var box;
  var overlay;
  var popup;
  var dismissCallback;

  function isPopupVisible() {
    if (box) {
      return box.style.display === 'block';
    } else {
      return false;
    }
  }

  function showPopup() {
    box.style.display = 'block';
  }

  function hidePopup() {
    box.style.display = 'none';
  }

  function createCloseCallback(callback, id, prompt) {
    return function() {
      var text;
      if (prompt) {
        text = d.getElementById(inputId).value;
      }
      hidePopup();
      callback(id, text);
    }
  }

  function hasCssClass(name) {
    for (var i = 0; i < d.styleSheets.length; ++i) {
      for (var j = 0; j < d.styleSheets[i].rules.length; ++j) {
        if (name === d.styleSheets[i].rules[j].selectorText) {
          return true;
        }
      }
    }
    return false;
  }

  function createStyleSheet() {
    if (!sheet) {
      var style = document.createElement('style');
      d.head.appendChild(style);
      sheet = style.sheet;
    }
  }

  function initCss() {
    var hasOverlay = hasCssClass('.cordova-ui-popupwindow-overlay');
    var hasPopup = hasCssClass('.cordova-ui-popupwindow');

    if (!hasOverlay) {
      createStyleSheet();

      sheet.insertRule('.cordova-ui-popupwindow-overlay {' +
        'background: #000000;' +
        'opacity: 0.6;' +
        'position: fixed;' +
        'top: 0;' +
        'left: 0;' +
        'margin: 0;' +
        'padding: 0;' +
        'width: 100%;' +
        'height: 100%;' +
        'z-index: 1200;' +
      '}');
    }

    if (!hasPopup) {
      createStyleSheet();

      sheet.insertRule('.cordova-ui-popupwindow {' +
        'position: fixed;' +
        'top: 50%;' +
        'left: 50%;' +
        'margin-right: -50%;' +
        'transform: translate(-50%, -50%);' +
        '-webkit-transform: translate(-50%, -50%);' +
        'z-index: 1201 !important;' +
        'color: #f8f6ef;' +
        'background: #2a2d30;' +
        'width: 90%;' +
        'padding: 6px;' +
      '}');
      sheet.insertRule('.cordova-ui-popupwindow .popup-title {' +
        'width: 100%;' +
        'height: 100%;' +
        'font-size: 1.0909090909090908rem;' +
        'background: #5093b6;' +
      '}');
      sheet.insertRule('.cordova-ui-popupwindow .popup-title p {' +
        'margin: 0rem 0rem;' +
        'padding: 0.5909090909090909rem 0.5rem;' +
      '}');
      sheet.insertRule('.cordova-ui-popupwindow .popup-text {' +
        'width: 100%;' +
        'color: #f9f9f9;' +
        'font-size: 1.0909090909090908rem;' +
        'background: #2a2d30;' +
      '}');
      sheet.insertRule('.cordova-ui-popupwindow .popup-text p {' +
        'text-align: left;' +
        'padding: 0.4rem;' +
      '}');
      sheet.insertRule('.cordova-ui-popupwindow .popup-input {' +
        'width: 100%;' +
        'padding-bottom: 0.4rem;' +
        'text-align: center;' +
      '}');
      sheet.insertRule('.cordova-ui-popupwindow .popup-input input {' +
        'width: 90%;' +
        'color: #222222;' +
        'font-size: 1rem;' +
        'line-height: 1.2;' +
        'font-weight: normal;' +
        'border: 1px solid #555;' +
        'border-radius: 5px;' +
        '-webkit-border-radius: 5px;' +
      '}');
      sheet.insertRule('.cordova-ui-popupwindow .popup-button-bg {' +
        'font-size: 1.4545454545454546rem;' +
        'background: #2a2d30;' +
        'width: 100%;' +
        'padding-top: 0.5rem;' +
        'padding-bottom: 0.5rem;' +
        'vertical-align: middle;' +
        'text-align: right;' +
      '}');
      sheet.insertRule('.cordova-ui-popupwindow .popup-button-bg input {' +
        'border: 1px solid #555;' +
        'border-radius: 5px;' +
        '-webkit-border-radius: 5px;' +
        'text-align: center;' +
        'display: inline-block;' +
        'background: #444;' +
        'color: #9ab;' +
        'font-size: 0.8em;' +
        'text-decoration: none;' +
        'margin: 1px 1px 1px 3px;' +
      '}');
    }
  }

  function initHtml() {
    var touchMoveDisable = function(e) {
      e.preventDefault();  // disable the touch-move of the background
    };

    box = d.createElement('div');
    box.id = boxId;

    overlay = box.appendChild(d.createElement('div'));
    overlay.id = overlayId;
    overlay.className = 'cordova-ui-popupwindow-overlay';
    overlay.addEventListener('click', function() {
      if (dismissCallback) {
        dismissCallback();
      }
    }, false);
    overlay.addEventListener('touchmove', touchMoveDisable);

    popup = box.appendChild(d.createElement('div'));
    popup.id = popupId;
    popup.className = 'cordova-ui-popupwindow';
    popup.addEventListener('touchmove', touchMoveDisable);

    hidePopup();

    d.getElementsByTagName('body')[0].appendChild(box);
  }

  function init() {
    if (!box) {
      initCss();
      initHtml();
    }
  }

  function show(options) {
    if (isPopupVisible()) {
      console.warn('Popup is already shown, ignoring.');
      return;
    }

    init();

    options = options || {};

    // prepare contents of the popup
    var html = '';
    html += '<div class="popup-title"><p>' + (options.title || 'Title') + '</p></div>';
    html += '<div class="popup-text"><p>' + (options.message || 'Message') + '</p></div>';
    if (options.prompt) {
      html += '<div class="popup-input"><input id="' + inputId + '" type="text" value="' + options.promptDefaultText + '" /></div>';
    }
    var buttons = options.buttons || ['Button'];
    html += '<div class="popup-button-bg">';
    for (var i = 0; i < buttons.length; ++i) {
      html += '<input id="' + buttonIdPrefix + (i + 1)
          + '" type="button" value="' + buttons[i] + '" />';
    }
    html += '</div>';

    popup.innerHTML = html;

    // link callbacks
    var callback = options.callback || function(){};
    dismissCallback = createCloseCallback(callback, 0, options.prompt);

    for (var i = 0; i < buttons.length; ++i) {
      var e = d.getElementById(buttonIdPrefix + (i + 1));
      e.addEventListener('click', createCloseCallback(callback, i + 1, options.prompt), false);
    }

    // show popup
    showPopup();
  }

  return {
    show: show
  };
})();

var notification = {
  alert: function(message, alertCallback, title, buttonName) {
    title = title || 'Alert';
    buttonName = buttonName || 'OK';
    popup.show({
      message: message,
      callback: alertCallback,
      title: title,
      buttons: [buttonName]
    });
  },
  confirm: function(message, confirmCallback, title, buttonLabels) {
    title = title || 'Confirm';
    buttonLabels = buttonLabels || ['OK', 'Cancel'];
    if (!Array.isArray(buttonLabels)) {
      if (typeof buttonLabels === 'string') {
        buttonLabels = buttonLabels.split(',');  // deprecated way of specifying the labels
      } else {
        buttonLabels = [buttonLabels];
      }
    }
    popup.show({
      message: message,
      callback: confirmCallback,
      title: title,
      buttons: buttonLabels
    });
  },
  prompt: function(message, promptCallback, title, buttonLabels, defaultText) {
    title = title || 'Prompt';
    buttonLabels = buttonLabels || ['OK', 'Cancel'];
    if (!Array.isArray(buttonLabels)) {
      buttonLabels = [buttonLabels];
    }
    defaultText = defaultText || '';
    popup.show({
      message: message,
      callback: function(idx, text) {
        promptCallback({buttonIndex: idx, input1: text});
      },
      title: title,
      buttons: buttonLabels,
      prompt: true,
      promptDefaultText: defaultText
    });
  },
  beep: function(times) {
    playback.beep(times);
  }
};

Object.freeze(notification);
Object.defineProperty(_navigator, 'notification', {
  configurable: false,
  enumerable: true,
  writable: false,
  value: notification
});

console.log('Loaded cordova.dialog API');

exports = function(require) {
};
