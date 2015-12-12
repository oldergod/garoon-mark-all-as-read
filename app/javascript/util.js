/**
 * @fileoverview Utilities.にXHJR系。
 * @author Benoit Quenaudon https://github.com/oldergod
 */
goog.provide('garoon.maar.util.notification');
goog.provide('garoon.maar.util.notification.xhr');
goog.provide('garoon.maar.util.request');
goog.provide('garoon.maar.util.request.xhr');

goog.require('goog.dom');
goog.require('goog.json');
goog.require('garoon.maar.FallbackButton');
goog.require('garoon.maar.NtfButton');
goog.require('garoon.maar.Notification');

/** @type {string} */
garoon.maar.util.request.xhr.REQUEST_TOKEN;

/**
 * @return {Promise<string>}
 */
garoon.maar.util.request.fetchRequestToken = function() {
  return garoon.maar.util.request.xhr.getRequestToken();
};

/**
 * If REQUEST_TOKEN is set, return it, otherwise get it through api.
 * TODO Benoit manage error when token has expired
 * @return {Promise<string>}
 */
garoon.maar.util.request.xhr.getRequestToken = function() {
  if (goog.isDefAndNotNull(garoon.maar.util.request.xhr.REQUEST_TOKEN)) {
    return Promise.resolve(garoon.maar.util.request.xhr.REQUEST_TOKEN);
  }

  // build SOAP request
  var soapRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
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

  var url = '/g/util_api/util/api.csp';
  var method = 'POST';
  var headers = new Headers();
  headers.append('Content-Type', 'text/xml');
  var body = soapRequest
  var cache = 'no-cache';
  var credentials = 'include';

  return fetch(url, /** @type {RequestInit} */ ({
      method: method,
      headers: headers,
      body: body,
      cache: cache,
      credentials: credentials
    }))
    .then(function(response) {
      if (response.ok) {
        return response.text().then(function(responseText) {
          garoon.maar.util.request.xhr.REQUEST_TOKEN = responseText.match(/[^>]+(?=<\/request_token>)/)[0];
          return garoon.maar.util.request.xhr.REQUEST_TOKEN;
        });
      } else {
        throw new TypeError()
      }
    }, function(error) {
      throw 'There has been a problem with your fetch operation: ' + error.message;
    });
};

/**
 * @return {Promise<Object>}
 */
garoon.maar.util.notification.xhr.getUnreadNotifications = function() {
  var url = '/g/v1/notification/list';
  var method = 'POST';
  var headers = new Headers();
  headers.append('Content-Type', 'text/json');
  var body = goog.json.serialize({
    'start': '2015-10-15T00:00:00Z'
  });
  var cache = 'no-cache';
  var credentials = 'include';
  return fetch(url, /** @type {RequestInit} */ ({
      method: method,
      headers: headers,
      body: body,
      cache: cache,
      credentials: credentials
    }))
    .then(function(response) {
      if (response.ok && response.headers.get("content-type") &&
        response.headers.get("content-type").toLowerCase().indexOf("application/json") >= 0) {
        return response.json()
      } else {
        throw new TypeError()
      }
    }, function(error) {
      throw 'There has been a problem with your fetch operation: ' + error.message;
    });
};

/**
 * @param {Object} jsonResponse
 * @return {Array<garoon.maar.Notification>}
 */
garoon.maar.util.notification.xhr.extractNotifications = function(jsonResponse) {
  if (jsonResponse['success']) {
    var notifications = [];
    for (var key in garoon.maar.Notification.MODULE) {
      if (!goog.array.isEmpty(jsonResponse[key])) {
        var moduleId = garoon.maar.Notification.MODULE[key];
        goog.array.forEach(jsonResponse[key], function(rawNotification) {
          var notification = new garoon.maar.Notification(moduleId, rawNotification.id, rawNotification.url);
          notifications.push(notification);
        });
      }
    }
    return notifications;
  } else {
    console.log('something went wrong but what ? session time out maybe ?', jsonResponse);
    throw 'extract failed';
  }
};

/**
 * @param {string} requestToken
 * @param {garoon.maar.Notification} notification
 * @return {Promise<boolean>}
 */
garoon.maar.util.notification.xhr.postMarkAsRead = function(requestToken, notification) {
  var soapRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
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
    garoon.maar.util.request.asSoapParameter(requestToken) +
    garoon.maar.util.notification.asSoapParameter(notification) +
    '</parameters>' +
    '</NotificationConfirmNotification>' +
    '</soap:Body>' +
    '</soap:Envelope>';

  var url = '/g/cbpapi/notification/api.csp';
  var method = 'POST';
  var headers = new Headers();
  headers.append('Content-Type', 'text/xml');
  var body = soapRequest
  var cache = 'no-cache';
  var credentials = 'include';

  return fetch(url, /** @type {RequestInit} */ ({
      method: method,
      headers: headers,
      body: body,
      cache: cache,
      credentials: credentials
    }))
    .then(function(response) {
      if (response.ok) {
        return true;
      } else {
        throw new TypeError()
      }
    }, function(error) {
      throw 'There has been a problem with your fetch operation: ' + error.message;
    });
};

/**
 * @param {garoon.maar.Notification} notification
 * @return {string}
 */
garoon.maar.util.notification.asSoapParameter = function(notification) {
  return '<notification_id module_id="' + notification.getModuleId() + '" item="' + notification.getItem() + '" />';
};

/**
 * @param {string} requestToken
 * @return {string}
 */
garoon.maar.util.request.asSoapParameter = function(requestToken) {
  return '<request_token>' + requestToken + '</request_token>';
};

garoon.maar.util.notification.SET_AS_NTF_BUTTONS = 'maar-set';

/**
 * @param {Array<garoon.maar.Notification>} notifications
 */
garoon.maar.util.notification.addNtfButtons = function(notifications) {
  var aTag, button;
  goog.array.forEach(notifications, function(notification) {
    aTag = garoon.maar.Notification.findNodeByUrl(notification);
    if (aTag) {
      goog.dom.classlist.add(aTag, garoon.maar.util.notification.SET_AS_NTF_BUTTONS);
      button = new garoon.maar.NtfButton(notification);
      garoon.maar.util.notification.renderButton(aTag, button);
    } else {
      // TODO benoit set rules for specific links that do not match what is in the json
      console.log('did not find aTag for', notification);
    };
  });
};

/**
 */
garoon.maar.util.notification.addFallbackButtons = function() {
  var notificationsPopup = goog.dom.getElement(garoon.maar.Notification.DIVS_POPUP_ID);
  var notificationDivs = notificationsPopup.getElementsByClassName(garoon.maar.Notification.DIV_CLASSNAME);
  var query = '.' + garoon.maar.Notification.TITLE_CLASSNAME + ' a:not(.' + garoon.maar.util.notification.SET_AS_NTF_BUTTONS + ')';
  var aTag, button, fetchUrl, notificationTitleDiv;
  goog.array.forEach(notificationDivs, function(notificationDiv) {
    aTag = notificationDiv.querySelector(query);
    if (goog.isDefAndNotNull(aTag)) {
      fetchUrl = aTag.pathname + aTag.search + aTag.hash;
      button = new garoon.maar.FallbackButton(fetchUrl);
      garoon.maar.util.notification.renderButton(aTag, button);
    }
  });
};

/**
 * @param {Element} aTag
 * @param {garoon.maar.Button} button
 */
garoon.maar.util.notification.renderButton = function(aTag, button) {
  var notificationTitleDiv = goog.dom.getAncestorByClass(aTag, garoon.maar.Notification.TITLE_CLASSNAME);
  var datetimeSpan = goog.dom.getFirstElementChild(notificationTitleDiv);
  button.renderBefore(datetimeSpan);
};
