import NotificationUtils from '../util/NotificationUtils';
import Button from '../model/Button';

export default class ContentScriptController {

  constructor() {
    this.targetNode = document.getElementById('popup_notification_header');
    if (!this.targetNode) {
      return;
    }

    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // If we have more than one added node,
        // then we are getting unread notifications.
        if (mutation.addedNodes.length > 1) {
          this.generateNtfMaarButtons();
        } else {
          if (Button.DEBUG) {
            // TODO(benoit) insert fixture ?
            let json = require('../../../test/fixtures.json');
            console.log(json);

            console.log(chrome.extension.getURL('assets/ic_clean_18dp.png'));
          }
        }
      });
    });
  }

  observe() {
    if (!this.observer) {
      return;
    }

    this.observer.observe(this.targetNode, {
      attributes: false,
      childList: true,
      characterData: false
    });
  }

  generateNtfMaarButtons() {
    NotificationUtils.getUnreadNotifications()
      .then(NotificationUtils.extractNotifications)
      .then(NotificationUtils.addClearAllButton)
      .then(NotificationUtils.addNtfButtons)
      .then(NotificationUtils.addFallbackButtons)
      .catch(e => {
        console.log(e);
      });
  }
}
