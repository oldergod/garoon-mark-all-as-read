goog.provide('garoon.maar.Button');

goog.require('garoon.maar.Notification');
goog.require('garoon.maar.soy');
goog.require('goog.net.XhrIo');
goog.require('goog.soy');
goog.require('goog.ui.Component');

/**
 * @param {garoon.maar.Notification} notification
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
garoon.maar.Button = function(notification, opt_domHelper) {
  garoon.maar.Button.base(this, 'constructor', opt_domHelper);

  /**
   * @private
   * @type {garoon.maar.Notification}
   */
  this.notification_ = notification;
};
goog.inherits(garoon.maar.Button, goog.ui.Component);

garoon.maar.Button.prototype.createDom = function() {
  var el = goog.soy.renderAsElement(garoon.maar.soy.buttonDiv, null, null, this.getDomHelper());
  this.setElementInternal(el);
};

garoon.maar.Button.prototype.enterDocument = function() {
  garoon.maar.Button.base(this, 'enterDocument');
  var callButton = goog.dom.getFirstElementChild(this.getContentElement());
  this.getHandler().listen(callButton, goog.events.EventType.CLICK, this.markAsRead_);
};

garoon.maar.Button.prototype.markAsRead_ = function() {
  // TODO benoit
  // check token
  // mark as read
  // delete beautifully the dom
  // dispose itself

  garoon.maar.util.request.fetchRequestToken()
    .then(this.postMarkAsRead_.bind(this), function(e) { console.log('error', e);})
    .then(this.closeNotificationDom_.bind(this))
    .then(this.disposeSelf_.bind(this));
};

/**
 * @param {string} requestToken
 */
garoon.maar.Button.prototype.postMarkAsRead_ = function(requestToken) {
  return garoon.maar.util.notification.xhr.postMarkAsRead(requestToken, this.notification_);
};

/**
 * @param {boolean} markAsReadSucceeded
 */
garoon.maar.Button.prototype.closeNotificationDom_ = function(markAsReadSucceeded) {
  // find parent etc
};

garoon.maar.Button.prototype.disposeSelf_ = function() {
  this.dispose();
};
