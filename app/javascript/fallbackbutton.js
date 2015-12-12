/**
 * @fileoverview 既読化用のボタン。
 * @author Benoit Quenaudon https://github.com/oldergod
 */
goog.provide('garoon.maar.FallbackButton');

goog.require('garoon.maar.Button');
goog.require('goog.events.Event');

/**
 * @param {string} fetchUrl
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {garoon.maar.Button}
 */
garoon.maar.FallbackButton = function(fetchUrl, opt_domHelper) {
  garoon.maar.FallbackButton.base(this, 'constructor', opt_domHelper);

  /**
   * @private
   * @type {string}
   */
  this.fetchUrl_ = fetchUrl;
};
goog.inherits(garoon.maar.FallbackButton, garoon.maar.Button);

/**
 * @param {goog.events.Event} event
 */
garoon.maar.FallbackButton.prototype.markAsRead_ = function(event) {
  fetch(this.fetchUrl_, /** @type {RequestInit} */ ({
      credentials: 'include'
    }))
  .then(this.processAfterMarkAsRead.bind(this));

  event.stopPropagation();
};
