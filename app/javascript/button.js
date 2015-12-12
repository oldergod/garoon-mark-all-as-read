/**
 * @fileoverview 既読化用のボタン。
 * @author Benoit Quenaudon https://github.com/oldergod
 */
goog.provide('garoon.maar.Button');

goog.require('garoon.maar.soy');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.Event');
goog.require('goog.net.XhrIo');
goog.require('goog.soy');
goog.require('goog.ui.Component');

/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
garoon.maar.Button = function(opt_domHelper) {
  garoon.maar.Button.base(this, 'constructor', opt_domHelper);
};
goog.inherits(garoon.maar.Button, goog.ui.Component);

/**
 * @override
 */
garoon.maar.Button.prototype.createDom = function() {
  var el = goog.soy.renderAsElement(garoon.maar.soy.buttonDiv, null, null, this.getDomHelper());
  this.setElementInternal(el);
};

/**
 * @override
 */
garoon.maar.Button.prototype.enterDocument = function() {
  garoon.maar.Button.base(this, 'enterDocument');
  var callButton = goog.dom.getFirstElementChild(this.getContentElement());
  this.getHandler().listen(callButton, goog.events.EventType.CLICK, this.markAsRead_);
};

/**
 * @param {goog.events.Event} event
 */
garoon.maar.Button.prototype.markAsRead_ = goog.abstractMethod;

/**
 * @param {string} requestToken
 * @return {Promise<boolean>}
 */
garoon.maar.Button.prototype.postMarkAsRead_ = function(requestToken) {
  return garoon.maar.util.notification.xhr.postMarkAsRead(requestToken, this.notification_);
};

/**
 */
garoon.maar.Button.prototype.closeNotificationDom_ = function() {
  // find parent etc
  var notificationTopDiv = goog.dom.getAncestorByClass(this.getElement(), 'cloudHeader-grnNotification-item-grn');
  goog.dom.classlist.add(notificationTopDiv, 'maar-slide');
  setTimeout(function() {
    goog.dom.removeNode(notificationTopDiv);
  }, 600);
};

/**
 */
garoon.maar.Button.prototype.processAfterMarkAsRead = function() {
  console.log(this);
  this.closeNotificationDom_();
  this.disposeSelf_();
  garoon.maar.Button.adjustUnreadNotificationsNumber();
};

/**
 */
garoon.maar.Button.prototype.disposeSelf_ = function() {
  this.dispose();
};

/**
 * do a lot of unnecessary stuff but
 * needed to reset the icon unread notification number.
 */
garoon.maar.Button.adjustUnreadNotificationsNumber = function() {
  var span = goog.dom.getElement('notification_number');
  /** @type {number} */
  var unreadLeft = parseInt(span.innerText, 10);
  if (unreadLeft > 1) {
    span.innerText = (unreadLeft - 1).toString();
  } else {
    span.innerText = '';
    span.style.display = 'none';
  }
  var popup_notification_header = goog.dom.getElement('popup_notification_header');
  if (unreadLeft < 8) {
    popup_notification_header.style.height = '';
  }
};
