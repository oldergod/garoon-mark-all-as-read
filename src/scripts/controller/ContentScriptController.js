import DomUtils from '../util/DomUtils';
import XhrUtils from '../util/XhrUtils';
import Notification from '../model/Notification';
import Button from '../model/Button';
import Ken from '../model/Ken';

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

    // debug
    // this.ken = new Ken();
    // console.log(this.ken);
    // requestAnimationFrame(() => {
    //   document.body.appendChild(this.ken.createDom());
    //   requestAnimationFrame(() => {
    //     this.ken.walkFromToX({
    //       from: -50,
    //       to: 300,
    //       // not really smooth. Better be moving ken via requestAnimationFrame
    //       duration: 2000
    //     })
    //     // .then(() => this.ken.hadoken())
    //     .then(() => this.ken.shoryuken())
    //     .then(() => this.ken.tatsumaki())
    //     .then(() => this.ken.hadoken())
    //     .then(() => this.ken.tatsumaki());
    //   });
    // });
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
      .then(Notification.fromJson)
      .then(DomUtils.addClearAllButton)
      .then(DomUtils.addNtfButtons)
      .then(DomUtils.addFallbackButtons)
      .catch(e => {
        console.log(e);
      });
  }
}
