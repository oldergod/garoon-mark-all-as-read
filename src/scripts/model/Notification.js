export default class Notification {
  constructor(moduleId, item, url) {
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
  }

  getModuleId() {
    return this.moduleId_;
  }

  getItem() {
    return this.item_;
  }

  getUrl() {
    return this.url_;
  }

  /** notifications parent popup id */
  static get DIVS_POPUP_ID() {
      return 'popup_notification_header';
    }
    /** main div name for notifications */
  static get DIV_CLASSNAME() {
      return 'cloudHeader-grnNotification-item-grn';
    }
    /** title div name for notifications */
  static get TITLE_CLASSNAME() {
    return 'cloudHeader-grnNotification-itemTitle-grn';
  }

  /**
   * 通知種類一覧
   * @enum {string}
   */
  static get MODULE() {
    return {
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
  }

  /**
   * url から通知のnodeを検索する関数
   * @param {garoon.maar.Notification} notification
   * @return {Element?}
   */
  findNodeByUrl() {
    let query = `.${Notification.DIV_CLASSNAME} ` +
      `.${Notification.TITLE_CLASSNAME} ` +
      `a[href^="${this.parsePathnameAndSearch()}"]`;

    return document.querySelector(query);
  }

  /**
   * parse an url, returns its path and its needed query and frament.
   * @return {string}
   */
  parsePathnameAndSearch() {
    let pathname = this.url_.pathname;
    let search;
    let fragment = '';
    switch (this.moduleId_) {
      case Notification.MODULE.bulletin:
        search = '?' + Notification.concatParams(this.queryAsObject_(), ['aid', 'nid']);
        break;
      case Notification.MODULE['space.discussion']:
        pathname = '/g/space/top.csp';
        search = '?' + Notification.concatParams(this.queryAsObject_(), ['spid']);
        fragment = this.url_.hash;
        break;
      default:
        search = this.url_.search;
    }
    return pathname + search + fragment;
  }

  /**
   * parse query and returns its object form
   * @return {Object}
   */
  queryAsObject_() {
    let split;
    let queries = this.url_.search.replace(/^\?/, '').split('&');
    return queries.reduce((obj, query) => {
      split = query.split('=');
      obj[split[0]] = split[1];
      return obj;
    }, {});
  }

  /**
   * @param {Object} searchObject
   * @param {Array<string>} keys
   * @return {string}
   */
  static concatParams(searchObject, keys) {
    return keys.map(key =>
      `${key}=${searchObject[key]}`
    ).join('&');
  }

  static fromJson(jsonResponse) {
    /*jshint -W069 */
    if (jsonResponse['success']) {
      const notifications = [];
      for (let key in Notification.MODULE) {
        if (jsonResponse[key].length !== 0) {
          const moduleId = Notification.MODULE[key];
          let notification;
          jsonResponse[key].forEach((rawNotification) => {
            notification = new Notification(moduleId, rawNotification.id, rawNotification.url);
            notifications.push(notification);
          });
        }
      }
      return notifications;
    } else {
      console.log('something went wrong but what ? session time out maybe ?', jsonResponse);
      throw 'extract failed';
    }
  }
}
