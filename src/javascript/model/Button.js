import Notification from '../model/Notification';
import NotificationUtils from '../util/NotificationUtils';

export default class Button {
  constructor() {
    this.element_ = null;
  }

  static get DEBUG() {
    return false;
  }

  static get CROSS_WRAPPER_CLASSNAME() {
    return 'maar-cross-wrapper';
  }

  static get CROSS_CLASSNAME() {
    return 'maar-cross';
  }

  /** not used */
  static get INNER_HTML() {
    return '<div class="maar-cross-wrapper"><div class="maar-cross" title="\u901A\u77E5\u3092\u65E2\u8AAD\u306B\u3059\u308B"></div></div>';
  }

  createDom() {
    var crossWrapper = document.createElement('div');
    crossWrapper.classList.add(Button.CROSS_WRAPPER_CLASSNAME);
    var cross = document.createElement('div');
    cross.classList.add(Button.CROSS_CLASSNAME);
    cross.title = '\u901A\u77E5\u3092\u65E2\u8AAD\u306B\u3059\u308B';
    crossWrapper.appendChild(cross);
    return crossWrapper;
  }

  renderBefore(referenceTag) {
    this.element_ = this.createDom();
    referenceTag.parentNode.insertBefore(this.element_, referenceTag);
    this.enterDocument();
  }

  enterDocument() {
    this.element_.onclick = this.markAsRead_.bind(this);
  }

  markAsRead_() {
    throw 'I am markAsRead_ ! Override me !';
  }

  closeNotificationDom_() {
    let notificationTopDiv = this.element_.closest('.' + Notification.DIV_CLASSNAME);
    let currentHeight = window.getComputedStyle(notificationTopDiv).getPropertyValue('height');
    notificationTopDiv.style.height = currentHeight;
    setTimeout(() => {
      notificationTopDiv.classList.add('maar-fadeout');
    }, 0);
    setTimeout(() => {
      notificationTopDiv.remove();
      Button.adjustPopupHeight();
    }, 150);
  }


  processAfterMarkAsRead() {
    this.closeNotificationDom_();
    Button.adjustUnreadNotificationsNumber();
  }

  /**
   * do a lot of unnecessary stuff but
   * needed to reset the icon unread notification number.
   */
  static adjustUnreadNotificationsNumber() {
    let span = document.querySelector('#notification_number');
    let unreadLeft = parseInt(span.innerText, 10);
    if (unreadLeft > 1) {
      span.innerText = (unreadLeft - 1).toString();
    } else {
      span.innerText = '';
      span.style.display = 'none';
      document.querySelector('#popup_notification_header .cloudHeader-grnNotification-update-grn').click();
    }
  }

  static adjustPopupHeight() {
    let popup_notification_header = document.querySelector('#popup_notification_header');
    if (popup_notification_header.style.height !== '' && popup_notification_header.scrollHeight <= parseInt(popup_notification_header.style.height, 10) + 1) {
      popup_notification_header.style.height = '';
    }
  }
}
