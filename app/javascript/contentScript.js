/**
 * @fileoverview エントリーポイント用のファイル。
 * @author Benoit Quenaudon https://github.com/oldergod
 */

import ContentScriptController from './controller/ContentScriptController';

new ContentScriptController().observe();
