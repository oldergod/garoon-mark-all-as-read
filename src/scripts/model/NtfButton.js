import Button from './Button';
import XhrUtils from '../util/XhrUtils';

export default class NtfButton extends Button {
  /**
   * @param {Notification} notification
   * @constructor
   */
  constructor(notification) {
    super();

    this.notification_ = notification;
  }

  /**
   * @override
   */
  markAsRead_(event) {
    XhrUtils.fetchRequestToken()
      .then(this.postMarkAsRead_.bind(this))
      .then(this.processAfterMarkAsRead.bind(this));

    event.stopPropagation();
  }

  /**
   * @param {string} requestToken
   * @return {Promise<boolean>}
   */
  postMarkAsRead_(requestToken) {
    if (Button.debugMode()) {
      return Promise.resolve(true);
    }
    return XhrUtils.postMarkAsRead(requestToken, this.notification_);
  }
}
