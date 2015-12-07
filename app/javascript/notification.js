goog.provide('garoon.maar.Notification');

goog.require('goog.ui.Component');

/**
 * @param {string} moduleId
 * @param {number} item
 * @param {string} url
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
garoon.maar.Notification = function(moduleId, item, url, opt_domHelper) {
  garoon.maar.Notification.base(this, 'constructor', opt_domHelper);
  /**
   * @private
   * @type {string}
   */
  this.moduleId_ = moduleId;

  /**
   * @private
   * @type {number}
   */
  this.item_ = item;

  /**
   * @private
   * @type {string}
   */
  this.url_ = url;
};
goog.inherits(garoon.maar.Notification, goog.ui.Component);

/** main div name for notifications */
garoon.maar.Notification.DIV_CLASSNAME = '.cloudHeader-grnNotification-item-grn';
/** title div name for notifications */
garoon.maar.Notification.TITLE_CLASSNAME = '.cloudHeader-grnNotification-itemTitle-grn';

/**
 * @param {string} url
 */
garoon.maar.Notification.findDomByUrl = function(url) {
  var link = document.querySelector(garoon.maar.Notification.DIV_CLASSNAME + ' ' +
    garoon.maar.Notification.TITLE_CLASSNAME +
    ' a[href="' + garoon.maar.util.parsePathnameAndSearch(url) + '"]');
  if (link) {
    // found it, link it and render
  } else {
    console.log('not found, we might refresh the ntf and if still unfound, give up');
  }
};

/**
 * @return {string}
 */
garoon.maar.Notification.prototype.getModuleId = function() {
  return this.moduleId_;
};

/**
 * @return {number}
 */
garoon.maar.Notification.prototype.getItem = function() {
  return this.item_;
};

/**
 * @return {string}
 */
garoon.maar.Notification.prototype.getUrl = function() {
  return this.url_;
};

/**
 * @enum {string}
 */
garoon.maar.Notification.MODULE = {
  'phoneMemo': 'grn.phonemessage',
  'workflow': 'grn.workflow',
  'message': 'grn.message',
  'mail': 'grn.mail',
  'schedule.facility_approval': 'grn.schedule.facility_approval',
  'schedule': 'grn.schedule',
  'bulletin': 'grn.bulletin',
  'file': 'grn.cabinet',
  'report': 'grn.report',
  'space.discussion': 'grn.space.discussion',
  'space.todo': 'grn.space.todo',
  'space': 'grn.space'
};
