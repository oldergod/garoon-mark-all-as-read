import Button from './Button';
import NotificationUtils from '../util/NotificationUtils';

export default class FallbackButton extends Button {
  /**
   * @param {string} fetchUrl
   */
  constructor(fetchUrl) {
    super();

    this.fetchUrl_ = fetchUrl;
  }

  /**
   * @override
   */
  markAsRead_(event) {
    this.fetch()
      .then(this.processAfterMarkAsRead.bind(this));

    event.stopPropagation();
  }

  fetch() {
    if (Button.DEBUG) {
      return Promise.resolve(true);
    }
    return window.fetch(this.fetchUrl_, {
      credentials: 'include'
    });
  }
}
