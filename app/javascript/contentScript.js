/**
 * @fileoverview エントリーポイント用のファイル。
 * @author Benoit Quenaudon https://github.com/oldergod
 */
goog.provide('garoon.maar.contentScript.init');

// goog.require('garoon.maar.Button');
goog.require('garoon.maar.Notification');
goog.require('garoon.maar.util');

/**
 */
garoon.maar.contentScript.init = function() {
  garoon.maar.util.getUnreadNotifications().then(function(jsonResponse) {
    if (jsonResponse['success']) {
      var notifications = [];
      for (var key in garoon.maar.Notification.MODULE) {
        if (!goog.array.isEmpty(jsonResponse[key])) {
          var moduleId = garoon.maar.Notification.MODULE[key];
          goog.array.forEach(jsonResponse[key], function(rawNotification) {
            notifications.push(new garoon.maar.Notification(moduleId, rawNotification.id, rawNotification.url));
          });
        }
      }
      return notifications;
    } else {
      console.log('something went wrong but what ? session time out maybe ?', jsonResponse);
    }
  }).then(function(notifications) {
    var dom;
    goog.array.forEach(notifications, function(notification) {
      dom = garoon.maar.Notification.findDomByUrl(notification.getUrl());
      if (dom) {
        console.log('found dom for url', notification.getUrl(), dom);
      } else {
        console.log('did not find dom for', notification.getUrl());
      };
    });
  });
  // var ntfTitle = goog.dom.getElement('applicationMenu');
  // console.log('contentScript init', ntfTitle);
  // if (!ntfTitle) {
  //  return;
  // }
  // var button = new garoon.maar.Button();
  // button.render(ntfTitle);
};

setTimeout(function() {
  // TODO benoit not need to render first but only when the update button is pressed. so we need to listen to either click on the <a #cloudHeader-grnNotificationTitle-grn> or some other thing.
  garoon.maar.contentScript.init();
}, 0);

console.log('content script started');
