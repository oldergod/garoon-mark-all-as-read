/**
 * @fileoverview エントリーポイント用のファイル。
 * @author Benoit Quenaudon https://github.com/oldergod
 */
goog.provide('garoon.maar.contentScript.init');

// goog.require('garoon.maar.Button');
goog.require('garoon.maar.Notification');
goog.require('garoon.maar.util.notification');

/**
 * Init function called when Content Script is ready.
 * Create Observer that adds MarkAsRead button to all ntf.
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
 * get unread notifications, and add to their respective dom
 * a Mark As Read button.
 */
garoon.maar.contentScript.generateNtfMaarButtons = function() {
  garoon.maar.util.notification.xhr.getUnreadNotifications()
    .then(garoon.maar.util.notification.xhr.extractNotifications)
    .then(garoon.maar.util.notification.addNtfButtons);
};

garoon.maar.contentScript.init();
