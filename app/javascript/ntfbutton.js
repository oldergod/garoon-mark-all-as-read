/**
 * @fileoverview 既読化用のボタン。
 * @author Benoit Quenaudon https://github.com/oldergod
 */
goog.provide('garoon.maar.NtfButton');

goog.require('garoon.maar.Button');
goog.require('garoon.maar.Notification');
goog.require('goog.events.Event');

/**
 * @param {garoon.maar.Notification} notification
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {garoon.maar.Button}
 */
garoon.maar.NtfButton = function(notification, opt_domHelper) {
  garoon.maar.NtfButton.base(this, 'constructor', opt_domHelper);

  /**
   * @private
   * @type {garoon.maar.Notification}
   */
  this.notification_ = notification;
};
goog.inherits(garoon.maar.NtfButton, garoon.maar.Button);

/**
 * @param {goog.events.Event} event
 */
garoon.maar.NtfButton.prototype.markAsRead_ = function(event) {
  garoon.maar.util.request.fetchRequestToken()
    .then(this.postMarkAsRead_.bind(this))
    .then(this.processAfterMarkAsRead.bind(this));

  event.stopPropagation();
};

/**
 * @param {string} requestToken
 * @return {Promise<boolean>}
 */
garoon.maar.NtfButton.prototype.postMarkAsRead_ = function(requestToken) {
  if (garoon.maar.Button.DEBUG) {
    return Promise.resolve(true);
  }
  return garoon.maar.util.notification.xhr.postMarkAsRead(requestToken, this.notification_);
};
