import Button from './Button';
// import NotificationUtils from '../util/NotificationUtils';

export default class ClearAllButton extends Button {
  constructor(notifications) {
    super();

    /**
     * 通知
     * @private
     * @type {Notification}
     */
    this.notifications = notifications;
  }

  /**
   * @override
   */
  markAsRead_(event) {
    // TODO(benoit) should mark all as read
    // this.fetch()
    //   .then(this.processAfterMarkAsRead.bind(this));

    // event.stopPropagation();
  }
}
