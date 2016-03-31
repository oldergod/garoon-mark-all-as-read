import Button from '../model/Button';
import ClearAllButton from '../model/ClearAllButton';
import FallbackButton from '../model/FallbackButton';
import Notification from '../model/Notification';
import NtfButton from '../model/NtfButton';

export default class DomUtils {
  constructor() {
    throw 'I am DomUtils. Do not instantiate me';
  }

  static addClearAllButton(notifications) {
    DomUtils.renderClearAllButton(new ClearAllButton(notifications));

    return notifications;
  }

  static addNtfButtons(notifications) {
    let aTag, button;
    notifications.forEach(notification => {
      aTag = notification.findNodeByUrl();
      if (aTag) {
        aTag.classList.add(DomUtils.SET_AS_NTF_BUTTONS);
        button = new NtfButton(notification);
        DomUtils.renderButton(aTag, button);
      } else {
        // TODO benoit set rules for specific links that do not match what is in the json
        console.log('did not find aTag for', notification);
      }
    });
  }

  static addFallbackButtons() {
    const notificationsPopup = document.getElementById(Notification.DIVS_POPUP_ID);
    const notificationDivs = Array.from(notificationsPopup.querySelectorAll(`.${Notification.DIV_CLASSNAME}`));
    const query = `.${Notification.TITLE_CLASSNAME} a:not(.${DomUtils.SET_AS_NTF_BUTTONS})`;
    let aTag, button, fetchUrl;

    for (let notificationDiv of notificationDivs) {
      aTag = notificationDiv.querySelector(query);
      if (aTag != null) {
        fetchUrl = aTag.pathname + aTag.search + aTag.hash;
        button = new FallbackButton(fetchUrl);
        DomUtils.renderButton(aTag, button);
      }
    }

    return notificationDivs;
  }

  static addUpdaterToLinks() {
    const notificationDivs = Array.from(document.querySelectorAll(`#${Notification.DIVS_POPUP_ID} .${Notification.DIV_CLASSNAME}`));
    for (let notificationDiv of notificationDivs) {
      const aTag = notificationDiv.querySelector(`.${Notification.TITLE_CLASSNAME} a`);
      if (!aTag) {
        return;
      }
      aTag.addEventListener('click', (e) => {
        if (e.which === 1) {
          setTimeout(Button.adjustUnreadNotificationsNumber, 100);
        }
      });
    }
  }

  static get SET_AS_NTF_BUTTONS() {
    return 'maar-set';
  }

  static renderButton(aTag, button) {
    const notificationTitleDiv = aTag.closest(`.${Notification.TITLE_CLASSNAME}`);
    const datetimeSpan = notificationTitleDiv.firstElementChild;
    button.renderBefore(datetimeSpan);
  }

  static renderClearAllButton(button) {
    button.renderBefore(document.querySelector('.cloudHeader-grnNotification-update-grn'));
  }
}
