import Button from './Button';
import NotificationUtils from '../util/NotificationUtils';

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
    NotificationUtils.fetchRequestToken()
      .then(this.postMarkAsRead_.bind(this))
      .then(this.processAfterMarkAsRead.bind(this));

    event.stopPropagation();
  }

  /**
   * @param {string} requestToken
   * @return {Promise<boolean>}
   */
  postMarkAsRead_(requestToken) {
    if (Button.DEBUG) {
      return Promise.resolve(true);
    }
    return NotificationUtils.postMarkAsRead(requestToken, this.notification_);
  }
}
