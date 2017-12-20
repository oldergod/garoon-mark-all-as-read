/**
 * @fileoverview エントリーポイント用のファイル。
 * @author Benoit Quenaudon https://github.com/oldergod
 */

import ContentScriptController from './controller/ContentScriptController';
import XhrUtils from './util/XhrUtils';

new ContentScriptController().observe();
