import Button from './Button';
import Notification from '../model/Notification';
import XhrUtils from '../util/XhrUtils';

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

  createDom() {
    const crossWrapper = document.createElement('span');
    crossWrapper.classList.add(ClearAllButton.CLEAR_ALL_WRAPPER_CLASSNAME, 'action_button_base_grn');
    const cross = document.createElement('button');
    cross.classList.add(ClearAllButton.CLEAR_ALL_CLASSNAME, 'action_base_grn', 'button_style_off_grn');
    const span = document.createElement('span');
    span.classList.add('icon_inline_grn', 'icon_only_grn')
    cross.appendChild(span);
    // すべての通知を既読にする
    cross.title = '\u3059\u3079\u3066\u306e\u901a\u77e5\u3092\u65e2\u8aad\u306b\u3059\u308b';
    crossWrapper.appendChild(cross);
    return crossWrapper;
  }

  /**
   * @override
   */
  markAsRead_(event) {
    XhrUtils.fetchRequestToken()
      .then(this.postMarkAllAsRead_.bind(this))
      .then(ClearAllButton.processAfterMarkAllAsRead)
      .then(Button.adjustPopupHeight)
      .then(Button.emptyNotificationNumber);

    event.stopPropagation();
  }

  /**
   * @param {string} requestToken
   * @return {Promise<boolean>}
   */
  postMarkAllAsRead_(requestToken) {
    if (Button.debugMode()) {
      return Promise.resolve(true);
    }
    return XhrUtils.postMarkAllAsRead(requestToken, this.notifications_);
  }

  // TODO(benoit) clear all one by one beautifuly
  static processAfterMarkAllAsRead() {
    const notificationTopDivs = document.querySelectorAll(`.${Notification.DIV_CLASSNAME}`);

    const allPromises = Array.prototype.map.call(notificationTopDivs, (ntfTopDiv) => {
      return Button.closeNotificationDom(ntfTopDiv);
    });

    return Promise.all(allPromises);
  }
}
