import DomUtils from '../util/DomUtils';
import XhrUtils from '../util/XhrUtils';
import Button from '../model/Button';

export default class ContentScriptController {

  constructor() {
    this.targetNode = document.getElementById('popup_notification_header');
    if (!this.targetNode) {
      return;
    }

    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // If we have more than seven added nodes,
        // then we are getting unread notifications.
        if (mutation.addedNodes.length > 7) {
          this.generateNtfMaarButtons();
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
    XhrUtils.getUnreadNotifications()
      .then(XhrUtils.extractNotifications)
      .then(DomUtils.addClearAllButton)
      .then(DomUtils.addNtfButtons)
      .then(DomUtils.addFallbackButtons)
      .catch(e => {
        console.log(e);
      });
  }
}
