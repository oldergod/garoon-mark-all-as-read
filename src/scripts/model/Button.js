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

  static get BACKGROUND_IMAGE_URL() {
    return chrome.extension.getURL('assets/ic_clear_18dp.png');
  }

  createDom() {
    const crossWrapper = document.createElement('div');
    crossWrapper.classList.add(Button.CROSS_WRAPPER_CLASSNAME);
    const cross = document.createElement('button');
    cross.classList.add(Button.CROSS_CLASSNAME);
    // 通知を既読にする 
    cross.title = '\u901A\u77E5\u3092\u65E2\u8AAD\u306B\u3059\u308B';
    cross.style.backgroundImage = 'url(' + Button.BACKGROUND_IMAGE_URL + ')';
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
    const notificationTopDiv = this.element_.closest(`.${Notification.DIV_CLASSNAME}`);
    const currentHeight = window.getComputedStyle(notificationTopDiv).getPropertyValue('height');
    notificationTopDiv.style.height = currentHeight;
    setTimeout(() => {
      notificationTopDiv.classList.add('maar-fadeout');
    }, 0);
    setTimeout(() => {
      notificationTopDiv.remove();
      Button.adjustPopupHeight();
      Button.adjustUnreadNotificationsNumber();
    }, 250);
  }

  processAfterMarkAsRead() {
    this.closeNotificationDom_();
  }

  /**
   * do a lot of unnecessary stuff but
   * needed to reset the icon unread notification number.
   */
  static adjustUnreadNotificationsNumber() {
    const span = document.getElementById('notification_number');
    const unreadLeft = parseInt(span.innerText, 10);
    if (unreadLeft > 1) {
      span.innerText = (unreadLeft - 1).toString();
    } else {
      span.innerText = '';
      span.style.display = 'none';
      // TODO(benoit) should do it with the api for each number, not only #issue-6
      // We also should probably
      // - recheck if there is or no left new unread ntf on the esever
      //   - if yes, just click the reload button
      //   - if no, just hide it (but still say garoon we 既読化 them)

      // TODO(benoit) 2016/2/16 call API check issues
      document.querySelector('#popup_notification_header .cloudHeader-grnNotification-update-grn').click();

      // we close the notifications popup
      // document.querySelector('.cloudHeader-dropdownMenu-grn').classList.remove('cloudHeader-dropdownMenu-open-grn');
    }
  }

  static adjustPopupHeight() {
    const popup_notification_header = document.getElementById('popup_notification_header');
    if (popup_notification_header.style.height !== '' && popup_notification_header.scrollHeight <= parseInt(popup_notification_header.style.height, 10) + 1) {
      popup_notification_header.style.height = '';
    }
  }
}