'use strict';

export default class Hadoken {
  constructor(ken) {
    this.ken_ = ken;

    /**
     * @type {number}
     * @private
     */
    this.fireInterval_;

    /**
     *
     * @type {boolean}
     * @private
     */
    this.hasHit_ = false;
  }

  createDom() {
    var el = goog.soy.renderAsElement(gaia.argoui.osf.ken.soy.div, {
      divClass: 'hado'
    }, null, this.getDomHelper());
    this.setElementInternal(el);
  }

  enterDocument() {
    gaia.argoui.osf.Hado.base(this, 'enterDocument');

    var self = this;
    setTimeout(function() {
      goog.dom.classlist.add(self.getElement(), 'moving');
    }, 20);

    self.fireInterval_ = setInterval(function() {
      self.ken_.dispatchEvent(new gaia.argoui.osf.FireEvent(self));
    }, 100);
    setTimeout(function() {
      self.hit();
    }, 3500);
  }

  hit() {
    if (!this.hasHit_) {
      this.hasHit_ = true;
      var self = this;
      clearInterval(self.fireInterval_);

      goog.dom.classlist.addRemove(self.getElement(), 'moving', 'explode');
      // remove 'moving' would make it go back to its initial transform,
      // so we need to balance this while exploding
      var left = window.getComputedStyle(this.getElement()).getPropertyValue('margin-left');
      this.getElement().style.marginLeft = (parseInt(left, 10) + 62) + 'px';
      setTimeout(function() {
        self.dispose();
      }, 3000);
    }
  }

  static get FIRE_EVENT() {
    return 'hadoken_fire_event';
  }

  getOffset() {
    return this.getElement().getBoundingClientRect();
    //return goog.style.getPageOffset(this.getElement());
  }
