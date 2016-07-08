import Akabei from './Akabei';
import Notification from '../model/Notification';
import XhrUtils from '../util/XhrUtils';

export default class Button {
  constructor() {
    this.element_ = null;
    this.clicked_ = false;
  }

  static get DEBUG() {
    return '@DEBUG-ON@';
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
    const crossWrapper = document.createElement('div');
    crossWrapper.classList.add(Button.CROSS_WRAPPER_CLASSNAME);
    const cross = document.createElement('button');
    cross.classList.add(Button.CROSS_CLASSNAME);
    // 通知を既読にする
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
    this.element_.addEventListener('click', (event) => {
      if (this.clicked_) {
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
      this.clicked_ = true;

      return this.markAsRead_(event);
    })
  }

  markAsRead_(event) {
    throw 'I am markAsRead_ ! Override me !';
  }

  closeNotificationDom_() {
    const notificationTopDiv = this.element_.closest(`.${Notification.DIV_CLASSNAME}`);

    // no special meaning, some random only
    if (Button.DEBUG == '@DEBUG-ON@' || +new Date % 30 === 0) {
      return this.closeNotificationDomAkabei_(notificationTopDiv);
    }

    return Button.closeNotificationDom(notificationTopDiv);
  }

  closeNotificationDomAkabei_(notificationTopDiv) {
    const ntfBoundingRect = notificationTopDiv.getBoundingClientRect();
    const ntfMiddleTop = ntfBoundingRect.top + ntfBoundingRect.height / 2;
    const akabeiTop = ntfMiddleTop - Akabei.HEIGHT / 2;
    const akabeiHitAtY = ntfBoundingRect.left;

    const akabei = new Akabei(document.body, akabeiTop);
    return Promise.resolve(akabei.render())
      .then(() => akabei.hitAtY(akabeiHitAtY))
      .then(() => Button.closeNotificationDom(notificationTopDiv))
      .then(() => Akabei.remove(akabei));
  }

  static closeNotificationDom(ntfTopDiv) {
    const currentHeight = window.getComputedStyle(ntfTopDiv).getPropertyValue('height');
    requestAnimationFrame(() => {
      ntfTopDiv.style.height = currentHeight;
      // trigger layout
      ntfTopDiv.getBoundingClientRect();

      ntfTopDiv.classList.add('maar-fadeout');
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        ntfTopDiv.remove();
        resolve();
      }, 300);
    });
  }

  processAfterMarkAsRead() {
    this.closeNotificationDom_()
      .then(Button.adjustPopupHeight)
      .then(Button.adjustUnreadNotificationsNumber);
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
      XhrUtils.updateNotificationCountCookies();
    } else {
      Button.emptyNotificationNumber(span);
    }
  }

  static emptyNotificationNumber(span = document.getElementById('notification_number')) {
    span.innerText = '';
    span.style.display = 'none';
    // TODO(benoit) should do it with the api for each number, not only #issue-6
    // We also should probably
    // - recheck if there is or no left new unread ntf on the server
    //   - if yes, just click the reload button
    //   - if no, just hide it (but still say garoon we 既読化 them)

    // TODO(benoit) 2016/2/16 call API check issues
    document.querySelector('#popup_notification_header .cloudHeader-grnNotification-update-grn').click();

    // we close the notifications popup
    // document.querySelector('.cloudHeader-dropdownMenu-grn').classList.remove('cloudHeader-dropdownMenu-open-grn');
  }

  static adjustPopupHeight() {
    const popup_notification_header = document.getElementById('popup_notification_header');
    if (popup_notification_header.style.height !== '' && popup_notification_header.scrollHeight <= parseInt(popup_notification_header.style.height, 10) + 5) {
      popup_notification_header.style.height = '';
    }
  }
}
