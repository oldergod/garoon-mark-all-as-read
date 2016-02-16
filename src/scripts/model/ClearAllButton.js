import Button from './Button';
import Notification from '../model/Notification';
import NotificationUtils from '../util/NotificationUtils';

export default class ClearAllButton extends Button {
  constructor(notifications) {
    super();

    /**
     * 通知
     * @private
     * @type {Notification}
     */
    this.notifications_ = notifications;
  }

  static get CLEAR_ALL_WRAPPER_CLASSNAME() {
    return 'maar-clear-all-wrapper';
  }

  static get CLEAR_ALL_CLASSNAME() {
    return 'maar-clear-all';
  }

  static get BACKGROUND_IMAGE_URL() {
    return chrome.extension.getURL('assets/ic_clear_all_18dp.png');
  }

  createDom() {
    const crossWrapper = document.createElement('span');
    crossWrapper.classList.add(ClearAllButton.CLEAR_ALL_WRAPPER_CLASSNAME);
    const cross = document.createElement('button');
    cross.classList.add(ClearAllButton.CLEAR_ALL_CLASSNAME);
    cross.style.backgroundImage = 'url(' + ClearAllButton.BACKGROUND_IMAGE_URL + ')';
    // すべての通知を既読にする
    cross.title = '\u3059\u3079\u3066\u306e\u901a\u77e5\u3092\u65e2\u8aad\u306b\u3059\u308b\u3002';
    crossWrapper.appendChild(cross);
    return crossWrapper;
  }

  /**
   * @override
   */
  markAsRead_(event) {
    NotificationUtils.fetchRequestToken()
      .then(this.postMarkAllAsRead_.bind(this))
      .then(this.processAfterMarkAllAsRead.bind(this));

    event.stopPropagation();
  }

  /**
   * @param {string} requestToken
   * @return {Promise<boolean>}
   */
  postMarkAllAsRead_(requestToken) {
    if (Button.DEBUG) {
      return Promise.resolve(true);
    }
    return NotificationUtils.postMarkAllAsRead(requestToken, this.notifications_);
  }

  // TODO(benoit) clear all one by one beautifuly
  processAfterMarkAllAsRead() {
    const notificationTopDivs = document.querySelectorAll(`.${Notification.DIV_CLASSNAME}`);
    Array.prototype.forEach.call(notificationTopDivs, (ntfTopDiv) => {
      const currentHeight = window.getComputedStyle(ntfTopDiv).getPropertyValue('height');
      ntfTopDiv.style.height = currentHeight;
      setTimeout(() => {
        ntfTopDiv.classList.add('maar-fadeout');
      }, 0);
      setTimeout(() => {
        ntfTopDiv.remove();
        Button.adjustPopupHeight();
        Button.adjustUnreadNotificationsNumber();
      }, 250);
    });
  }
}
