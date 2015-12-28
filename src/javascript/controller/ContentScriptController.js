import NotificationUtils from '../util/NotificationUtils';

export default class ContentScriptController {

  constructor() {
    this.targetNode = document.getElementById('popup_notification_header');

    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // If we have more than one added node,
        // then we are getting unread notifications.
        if (mutation.addedNodes.length > 1) {
          this.generateNtfMaarButtons();
        }
      });
    });
  }

  observe() {
    this.observer.observe(this.targetNode, {
      attributes: false,
      childList: true,
      characterData: false
    });
  }

  generateNtfMaarButtons() {
    NotificationUtils.getUnreadNotifications()
      .then(NotificationUtils.extractNotifications)
      .then(NotificationUtils.addNtfButtons)
      .then(NotificationUtils.addFallbackButtons);
  }
}
