/**
 * @fileoverview エントリーポイント用のファイル。
 * @author Benoit Quenaudon https://github.com/oldergod
 */

import ContentScriptController from './controller/ContentScriptController';
import XhrUtils from './util/XhrUtils';

new ContentScriptController().observe();

// どのページでも最初からクッキーズに入っている通知数を更新
setTimeout(XhrUtils.updateNotificationCountCookies);
