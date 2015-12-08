goog.provide('garoon.maar.Notification');

goog.require('goog.ui.Component');

/**
 * @param {string} moduleId
 * @param {number} item
 * @param {string} url
 * @constructor
 */
garoon.maar.Notification = function(moduleId, item, url) {
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

/** main div name for notifications */
garoon.maar.Notification.DIV_CLASSNAME = '.cloudHeader-grnNotification-item-grn';
/** title div name for notifications */
garoon.maar.Notification.TITLE_CLASSNAME = '.cloudHeader-grnNotification-itemTitle-grn';

/**
 * @param {string} url
 */
garoon.maar.Notification.findDomByUrl = function(url) {
  var query = garoon.maar.Notification.DIV_CLASSNAME + ' ' +
    garoon.maar.Notification.TITLE_CLASSNAME +
    ' a[href^="' + garoon.maar.util.parsePathnameAndSearch(url) + '"]';
    // console.log('query is ', query);
  var link = document.querySelector(query);
  if (link) {
    return link;
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
