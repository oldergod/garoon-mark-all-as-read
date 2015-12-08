/**
 * @fileoverview エントリーポイント用のファイル。
 * @author Benoit Quenaudon https://github.com/oldergod
 */
goog.provide('garoon.maar.contentScript.init');

// goog.require('garoon.maar.Button');
goog.require('garoon.maar.Notification');
goog.require('garoon.maar.util');

/**
 */
garoon.maar.contentScript.init = function() {
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 1) {
        garoon.maar.contentScript.generateNtfMaarButtons();
      }
    });
  });

  var observerConfig = /** @type {MutationObserverInit} */ ({
    attributes: false,
    childList: true,
    characterData: false
  });

  var targetNode = goog.dom.getElement('popup_notification_header');
  observer.observe(targetNode, observerConfig);
};

/**
 */
garoon.maar.contentScript.generateNtfMaarButtons = function() {
  garoon.maar.util.notification.xhr.getUnreadNotifications()
    .then(garoon.maar.util.notification.xhr.extractNotifications)
    .then(garoon.maar.util.notification.addNtfButtons);
};

setTimeout(function() {
  // TODO benoit not need to render first but only when the update button is pressed. so we need to listen to either click on the <a #cloudHeader-grnNotificationTitle-grn> or some other thing.
  garoon.maar.contentScript.init();
}, 0);

