import Notification from '../model/Notification';
import NtfButton from '../model/NtfButton';
import FallbackButton from '../model/FallbackButton';

let _requestToken = null;
export default class NotificationUtils {
  constructor() {
    throw 'I am NotificationUtils. Do not instantiate me';
  }

  static getUnreadNotifications() {
    let url = '/g/v1/notification/list';
    let method = 'POST';
    let headers = new Headers();
    headers.append('Content-Type', 'text/json');
    let body = JSON.stringify({
      'start': '2015-10-15T00:00:00Z'
    });
    let cache = 'no-cache';
    let credentials = 'include';
    return fetch(url, {
        method,
        headers,
        body,
        cache,
        credentials
      })
      .then(response => {
        if (response.ok && response.headers.get("content-type") &&
          response.headers.get("content-type").toLowerCase().indexOf("application/json") >= 0) {
          return response.json();
        } else {
          throw new TypeError();
        }
      }, error => {
        throw 'There has been a problem with your fetch operation: ' + error.message;
      });
  }

  static extractNotifications(jsonResponse) {
    /*jshint -W069 */
    if (jsonResponse['success']) {
      let notifications = [];
      for (let key in Notification.MODULE) {
        if (jsonResponse[key].length !== 0) {
          let moduleId = Notification.MODULE[key];
          jsonResponse[key].forEach(rawNotification => {
            let notification = new Notification(moduleId, rawNotification.id, rawNotification.url);
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

  static addNtfButtons(notifications) {
    let aTag, button;
    notifications.forEach(notification => {
      aTag = notification.findNodeByUrl();
      if (aTag) {
        aTag.classList.add(NotificationUtils.SET_AS_NTF_BUTTONS);
        button = new NtfButton(notification);
        NotificationUtils.renderButton(aTag, button);
      } else {
        // TODO benoit set rules for specific links that do not match what is in the json
        console.log('did not find aTag for', notification);
      }
    });
  }

  static addFallbackButtons() {
    let notificationsPopup = document.getElementById(Notification.DIVS_POPUP_ID);
    let notificationDivs = notificationsPopup.querySelectorAll('.' + Notification.DIV_CLASSNAME);
    let query = '.' + Notification.TITLE_CLASSNAME + ' a:not(.' + NotificationUtils.SET_AS_NTF_BUTTONS + ')';
    let aTag, button, fetchUrl, notificationTitleDiv;
    // Chrome needs it.
    notificationDivs[Symbol.iterator] = Array.prototype[Symbol.iterator];
    for (let notificationDiv of notificationDivs) {
      aTag = notificationDiv.querySelector(query);
      if (aTag != null) {
        fetchUrl = aTag.pathname + aTag.search + aTag.hash;
        button = new FallbackButton(fetchUrl);
        NotificationUtils.renderButton(aTag, button);
      }
    }
  }

  static get SET_AS_NTF_BUTTONS() {
    return 'maar-set';
  }

  static renderButton(aTag, button) {
    let notificationTitleDiv = aTag.closest('.' + Notification.TITLE_CLASSNAME);
    let datetimeSpan = notificationTitleDiv.firstElementChild;
    button.renderBefore(datetimeSpan);
  }

  static get REQUEST_TOKEN() {
    return _requestToken;
  }

  static set REQUEST_TOKEN(rt) {
    _requestToken = rt;
  }

  /**
   * @return {Promise<string>}
   */
  static fetchRequestToken() {
    return NotificationUtils.getRequestToken();
  }

  /**
   * If REQUEST_TOKEN is set, return it, otherwise get it through api.
   * TODO Benoit manage error when token has expired
   * @return {Promise<string>}
   */
  static getRequestToken() {
    if (NotificationUtils.REQUEST_TOKEN != null) {
      return Promise.resolve(NotificationUtils.REQUEST_TOKEN);
    }

    // build SOAP request
    let soapRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">' +
      '<soap:Header>' +
      '<Action>UtilGetRequestToken</Action>' +
      '<Timestamp>' +
      '<Created>2010-08-12T14:45:00Z</Created>' +
      '<Expires>2037-08-12T14:45:00Z</Expires>' +
      '</Timestamp>' +
      '<Locale>jp</Locale>' +
      '</soap:Header>' +
      '<soap:Body>' +
      '<UtilGetRequestToken>' +
      '<parameters></parameters>' +
      '</UtilGetRequestToken>' +
      '</soap:Body>' +
      '</soap:Envelope>';

    let url = '/g/util_api/util/api.csp';
    let method = 'POST';
    let headers = new Headers();
    headers.append('Content-Type', 'text/xml');
    let body = soapRequest;
    let cache = 'no-cache';
    let credentials = 'include';

    return fetch(url, {
        method,
        headers,
        body,
        cache,
        credentials
      })
      .then(response => {
        if (response.ok) {
          return response.text().then(responseText => {
            NotificationUtils.REQUEST_TOKEN = responseText.match(/[^>]+(?=<\/request_token>)/)[0];
            return NotificationUtils.REQUEST_TOKEN;
          });
        } else {
          throw new TypeError();
        }
      }, error => {
        throw 'There has been a problem with your fetch operation: ' + error.message;
      });
  }

  /**
   * @param {string} requestToken
   * @param {garoon.maar.Notification} notification
   * @return {Promise<boolean>}
   */
  static postMarkAsRead(requestToken, notification) {
    let soapRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">' +
      '<soap:Header>' +
      '<Action>NotificationConfirmNotification</Action>' +
      '<Timestamp>' +
      '<Created>2010-08-12T14:45:00Z</Created>' +
      '<Expires>2037-08-12T14:45:00Z</Expires>' +
      '</Timestamp>' +
      '<Locale>jp</Locale>' +
      '</soap:Header>' +
      '<soap:Body>' +
      '<NotificationConfirmNotification>' +
      '<parameters>' +
      NotificationUtils.RequestTokenAsSoapParameter(requestToken) +
      NotificationUtils.NotificationAsSoapParameter(notification) +
      '</parameters>' +
      '</NotificationConfirmNotification>' +
      '</soap:Body>' +
      '</soap:Envelope>';

    let url = '/g/cbpapi/notification/api.csp';
    let method = 'POST';
    let headers = new Headers();
    headers.append('Content-Type', 'text/xml');
    let body = soapRequest;
    let cache = 'no-cache';
    let credentials = 'include';

    return fetch(url, {
        method,
        headers,
        body,
        cache,
        credentials
      })
      .then(response => {
        if (response.ok) {
          return true;
        } else {
          throw new TypeError();
        }
      }, error => {
        throw 'There has been a problem with your fetch operation: ' + error.message;
      });
  }

  /**
   * @param {garoon.maar.Notification} notification
   * @return {string}
   */
  static NotificationAsSoapParameter(notification) {
    return '<notification_id module_id="' + notification.getModuleId() + '" item="' + notification.getItem() + '" />';
  }

  /**
   * @param {string} requestToken
   * @return {string}
   */
  static RequestTokenAsSoapParameter(requestToken) {
    return '<request_token>' + requestToken + '</request_token>';
  }
}
