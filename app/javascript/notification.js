goog.provide('garoon.maar.Notification');

/**
 * @param {string} moduleId
 * @param {number} item
 * @constructor
 */
garoon.maar.Notification = function(moduleId, item) {
  /**
   * @private
   * @type {string}
   */
  this.moduleId_ = moduleId;

  /**
   * @private
   * @type {number}
   */
  this.item_ = item;
};

garoon.maar.Notification.prototype.getModuleId = function() {
	return this.moduleId_;
}

garoon.maar.Notification.prototype.getItem = function() {
	return this.item_;
}

garoon.maar.Notification.MODULE = {
  'phoneMemo': 'grn.phonemessage',
  'workflow': 'grn.workflow',
  'message': 'grn.message',
  'mail': 'grn.mail',
  'schedule.facility_approval': 'grn.schedule.facility_approval',
  'schedule': 'grn.schedule',
  'bulletin': 'grn.bulletin',
  'file': 'grn.cabinet',
  'report': 'grn.report',
  'space.discussion': 'grn.space.discussion',
  'space.todo': 'grn.space.todo',
  'space': 'grn.space'
};
