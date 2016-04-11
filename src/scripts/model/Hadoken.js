'use strict';

export default class Hadoken {
  constructor(ken) {
    this.ken_ = ken;

    this.fireInterval_;

    this.hasHit_ = false;
  }

  createDom() {
    this.element = document.createElement('div');
    this.element.classList.add('hadoken');
    return this.element;
  }

  render() {
    if (!this.element) {
      this.createDom();
    }
    this.ken_.element.appendChild(this.element);
  }

  enterDocument() {
    gaia.argoui.osf.Hado.base(this, 'enterDocument');

    setTimeout(() => {
      goog.dom.classlist.add(this.element, 'moving');
    }, 20);

    self.fireInterval_ = setInterval(function() {
      // self.ken_.dispatchEvent(new gaia.argoui.osf.FireEvent(self));
    }, 100);
  }

  hit() {
    if (!this.hasHit_) {
      this.hasHit_ = true;
      clearInterval(this.fireInterval_);

      goog.dom.classlist.addRemove(this.element, 'moving', 'explode');
      // remove 'moving' would make it go back to its initial transform,
      // so we need to balance this while exploding
      var left = window.getComputedStyle(this.element).getPropertyValue('margin-left');
      this.element.style.marginLeft = (parseInt(left, 10) + 62) + 'px';
    }
  }

  static get FIRE_EVENT() {
    return 'hadoken_fire_event';
  }

  getOffset() {
    return this.element.getBoundingClientRect();
  }
}
