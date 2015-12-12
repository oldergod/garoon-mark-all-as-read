/**
 * @fileoverview 通知モデル。
 * @author Benoit Quenaudon https://github.com/oldergod
 */
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
   * 通知種類
   * @private
   * @type {string}
   */
  this.moduleId_ = moduleId;

  /**
   * 通知ID
   * @private
   * @type {number}
   */
  this.item_ = item;

  /**
   * 通知が対象するurl
   * @private
   * @type {URL}
   */
  this.url_ = new URL(url);
};

/** notifications parent popup id */
garoon.maar.Notification.DIVS_POPUP_ID = 'popup_notification_header';
/** main div name for notifications */
garoon.maar.Notification.DIV_CLASSNAME = 'cloudHeader-grnNotification-item-grn';
/** title div name for notifications */
garoon.maar.Notification.TITLE_CLASSNAME = 'cloudHeader-grnNotification-itemTitle-grn';

/**
 * url から通知のnodeを検索する関数
 * @param {garoon.maar.Notification} notification
 * @return {Element|undefined}
 */
garoon.maar.Notification.findNodeByUrl = function(notification) {
  var query = '.' + garoon.maar.Notification.DIV_CLASSNAME + ' ' +
    '.' + garoon.maar.Notification.TITLE_CLASSNAME +
    ' a[href^="' + notification.parsePathnameAndSearch() + '"]';
  // console.log('query is ', query);
  var link = document.querySelector(query);
  if (link) {
    return link;
  }
  return undefined;
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
 * 通知種類一覧
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

/**
 * parse an url, returns its path and its needed query and frament.
 * @return {string}
 */
garoon.maar.Notification.prototype.parsePathnameAndSearch = function() {
  var pathname = this.url_.pathname;
  var search;
  var fragment = '';
  switch (this.moduleId_) {
    case garoon.maar.Notification.MODULE.bulletin:
      search = '?' + garoon.maar.Notification.concatParams(this.queryAsObject_(), ['aid', 'nid']);
      break;
    case garoon.maar.Notification.MODULE['space.discussion']:
      pathname = '/g/space/top.csp';
      search = '?' + garoon.maar.Notification.concatParams(this.queryAsObject_(), ['spid']);
      fragment = this.url_.hash;
      break;
    default:
      search = this.url_.search;
  }
  return pathname + search + fragment;
};

/**
 * parse query and returns its object form
 * @return {Object}
 */
garoon.maar.Notification.prototype.queryAsObject_ = function() {
  var searchObject = {};
  var queries = this.url_.search.replace(/^\?/, '').split('&');
  var split;
  for (var i = 0; i < queries.length; i++) {
    split = queries[i].split('=');
    searchObject[split[0]] = split[1];
  }
  return searchObject
};

/**
 * @param {Object} searchObject
 * @param {Array<string>} keys
 * @return {string}
 */
garoon.maar.Notification.concatParams = function(searchObject, keys) {
  var searchObjectAsString = '';
  for (var i = 0; i < keys.length; i++) {
    if (searchObjectAsString.length > 0) {
      searchObjectAsString += '&';
    }
    searchObjectAsString += keys[i] + '=' + searchObject[keys[i]];
  }
  return searchObjectAsString;
};
