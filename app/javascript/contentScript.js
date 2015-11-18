/**
 * @fileoverview エントリーポイント用のファイル。
 * @author Benoit Quenaudon https://github.com/oldergod
 */
goog.provide('garoon.maar.contentScript.init');

goog.require('garoon.maar.Button');

/**
 */
garoon.maar.contentScript.init = function() {
  var ntfTitle = goog.dom.getElement('applicationMenu');
  console.log('contentScript init', ntfTitle);
  if (!ntfTitle) {
  	return;
  }
  var button = new garoon.maar.Button();
  button.render(ntfTitle);
};

setTimeout(function() {
  garoon.maar.contentScript.init();
}, 0);

console.log('content script started');
