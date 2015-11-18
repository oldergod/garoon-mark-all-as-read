goog.provide('garoon.maar.Button');

goog.require('garoon.maar.Notification');
goog.require('garoon.maar.soy');
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

garoon.maar.Button.prototype.createDom = function() {
  var el = goog.soy.renderAsElement(garoon.maar.soy.buttonDiv, null, null, this.getDomHelper());
  this.setElementInternal(el);
};

garoon.maar.Button.prototype.enterDocument = function() {
  garoon.maar.Button.base(this, 'enterDocument');
  var callButton = goog.dom.getFirstElementChild(this.getContentElement());
  this.getHandler().listen(callButton, goog.events.EventType.CLICK, this.getAndMarkAllAsRead_);
};

garoon.maar.Button.prototype.getAndMarkAllAsRead_ = function() {
  garoon.maar.Button.getUnreadNotifications_();
};

garoon.maar.Button.getUnreadNotifications_ = function() {
  goog.net.XhrIo.send('/g/v1/notification/list', garoon.maar.Button.extractNotifications_, 'POST', goog.json.serialize({
    'start': '2015-10-15T00:00:00Z'
  }), {
    'Content-Type': 'text/json'
  });
};

/** @type {Array<garoon.maar.Notification>} */
garoon.maar.Button.NOTIFICATIONS;

garoon.maar.Button.extractNotifications_ = function(evt) {
  var jsonResponse = evt.target.getResponseJson();
  if (jsonResponse.success) {
    garoon.maar.Button.NOTIFICATIONS = [];
    for (var key in garoon.maar.Notification.MODULE) {
      if (!goog.array.isEmpty(jsonResponse[key])) {
        var moduleId = garoon.maar.Notification.MODULE[key];
        goog.array.forEach(jsonResponse[key], function(rawNotification) {
          garoon.maar.Button.NOTIFICATIONS.push(new garoon.maar.Notification(moduleId, rawNotification.id));
        });
      }
    }
    garoon.maar.Button.getRequestToken_();
  } else {
    // something went wrong but what ? session time out maybe ?
  }
};

garoon.maar.Button.markAllAsRead_ = function() {
  if (goog.array.isEmpty(garoon.maar.Button.NOTIFICATIONS)) {
    return;
  }

  garoon.maar.Button.markAllAsReadRequest_(garoon.maar.Button.NOTIFICATIONS);
};

garoon.maar.Button.markAllAsReadRequest_ = function(notifications) {
  // build SOAP request
  var soapRequest = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">' +
    '<soap:Header>' +
    '<Action>NotificationConfirmNotification</Action>' +
    '<Timestamp>' +
    '<Created>2010-08-12T14:45:00Z</Created>' +
    '<Expires>2037-08-12T14:45:00Z</Expires>' +
    '</Timestamp>' +
    '</soap:Header>' +
    '<soap:Body>' +
    '<NotificationConfirmNotification>' +
    '<parameters>' +
    garoon.maar.Button.requestTokenParameter_() +
    garoon.maar.Button.createNotificationParameters_(notifications) +
    '</parameters>' +
    '</NotificationConfirmNotification>' +
    '</soap:Body>' +
    '</soap:Envelope>';

  console.log(soapRequest);
  goog.net.XhrIo.send('/g/cbpapi/notification/api.csp', garoon.maar.Button.handleMAARXhrResponse_, 'POST', soapRequest, {
    'Content-Type': 'text/xml'
  });
};

garoon.maar.Button.handleMAARXhrResponse_ = function(evt) {
  console.log(evt.target);
  if (evt.target.success) {
    garoon.maar.Button.refreshUI_();
  }
};

garoon.maar.Button.refreshUI_ = function() {
  console.log('refresh ui');
};

/**
 * @param {Array<garoon.maar.Notification>} notifications
 */
garoon.maar.Button.createNotificationParameters_ = function(notifications) {
  return goog.array.map(notifications, function(notification) {
    return '<notification_id module_id="' + notification.getModuleId() + '" item="' + notification.getItem() + '" />';
  }).join('');
};

/** @type {string} */
garoon.maar.Button.REQUEST_TOKEN;

garoon.maar.Button.getRequestToken_ = function() {
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

  console.log(soapRequest);
  goog.net.XhrIo.send('/g/util_api/util/api.csp', garoon.maar.Button.handleRequestTokenXhrResponse_, 'POST', soapRequest, {
    'Content-Type': 'text/xml'
  });
};

garoon.maar.Button.handleRequestTokenXhrResponse_ = function(evt) {
  var responseText = evt.target.getResponseText();
  garoon.maar.Button.REQUEST_TOKEN = responseText.match(/[^>]+(?=<\/request_token>)/);

  garoon.maar.Button.markAllAsRead_();
};

garoon.maar.Button.requestTokenParameter_ = function() {
  return '<request_token>' + garoon.maar.Button.REQUEST_TOKEN + '</request_token>';
};
