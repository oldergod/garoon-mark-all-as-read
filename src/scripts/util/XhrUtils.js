import Notification from '../model/Notification';

let _requestToken = null;
export default class XhrUtils {
  constructor() {
    throw 'I am XhrUtils. Do not instantiate me';
  }

  static get REQUEST_TOKEN() {
    return _requestToken;
  }

  static set REQUEST_TOKEN(rt) {
    _requestToken = rt;
  }

  static getUnreadNotifications() {
    const url = '/g/v1/notification/list';
    const method = 'POST';
    const headers = new Headers();
    headers.append('Content-Type', 'text/json');
    const body = JSON.stringify({
      'start': '2015-10-15T00:00:00Z'
    });
    const cache = 'no-cache';
    const credentials = 'include';
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
        throw `There has been a problem with your fetch operation: ${error.message}`;
      });
  }

  /**
   * @return {Promise<string>}
   */
  static fetchRequestToken() {
    return XhrUtils.getRequestToken();
  }

  /**
   * If REQUEST_TOKEN is set, return it, otherwise get it through api.
   * TODO Benoit manage error when token has expired
   * @return {Promise<string>}
   */
  static getRequestToken() {
    if (XhrUtils.REQUEST_TOKEN != null) {
      return Promise.resolve(XhrUtils.REQUEST_TOKEN);
    }

    // build SOAP request
    const soapRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
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

    const url = '/g/util_api/util/api.csp';
    const method = 'POST';
    const headers = new Headers();
    headers.append('Content-Type', 'text/xml');
    const body = soapRequest;
    const cache = 'no-cache';
    const credentials = 'include';

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
            XhrUtils.REQUEST_TOKEN = responseText.match(/[^>]+(?=<\/request_token>)/)[0];
            return XhrUtils.REQUEST_TOKEN;
          });
        } else {
          throw new TypeError();
        }
      }, error => {
        throw `There has been a problem with your fetch operation: ${error.message}`;
      });
  }

  /**
   * @param {string} requestToken
   * @param {Notification} notification
   * @return {Promise<boolean>}
   */
  static postMarkAsRead(requestToken, notification) {
    return XhrUtils.postMarkAllAsRead(requestToken, [notification]);
  }

  /**
   * @param {string} requestToken
   * @param {Array<Notification<} notifications
   * @return {Promise<boolean>}
   */
  static postMarkAllAsRead(requestToken, notifications) {
    const soapRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
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
      XhrUtils.RequestTokenAsSoapParameter(requestToken) +
      XhrUtils.NotificationsAsSoapParameter(notifications) +
      '</parameters>' +
      '</NotificationConfirmNotification>' +
      '</soap:Body>' +
      '</soap:Envelope>';

    const url = '/g/cbpapi/notification/api.csp';
    const method = 'POST';
    const headers = new Headers();
    headers.append('Content-Type', 'text/xml');
    const body = soapRequest;
    const cache = 'no-cache';
    const credentials = 'include';

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
        throw `There has been a problem with your fetch operation: ${error.message}`;
      });
  }

  /**
   * @param {Notification} notification
   * @return {string}
   */
  static NotificationAsSoapParameter(notification) {
    return `<notification_id module_id="${notification.getModuleId()}" item="${notification.getItem()}" />`;
  }

  /**
   * @param {Array<Notification>} notifications
   * @return {string}
   */
  static NotificationsAsSoapParameter(notifications) {
    return notifications.map(ntf => {
      return `<notification_id module_id="${ntf.getModuleId()}" item="${ntf.getItem()}" />`;
    }).join('');
  }

  /**
   * @param {string} requestToken
   * @return {string}
   */
  static RequestTokenAsSoapParameter(requestToken) {
    return `<request_token>${requestToken}</request_token>`;
  }
}
