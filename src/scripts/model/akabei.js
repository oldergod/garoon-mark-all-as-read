'use strict';

export default class Akabei {
  constructor(parent_ = parent_, akabeiTop) {
    this.parent_ = parent_;
    this.hasHit_ = false;
    this.hitAt_ = null;
    this.resolver_ = null;
    this.currentX = 0;
    this.startX = 0;
    this.element = null;

    if (akabeiTop) {
      document.documentElement.style.setProperty('--akabei-top', akabeiTop + 'px');
    }
  }

  static get HEIGHT() {
    return '30';
  }

  createDom() {
    this.element = document.createElement('div');
    this.element.classList.add('akabei');
    return this.element;
  }

  render() {
    if (!this.element) {
      this.createDom();
    }
    this.parent_.appendChild(this.element);

    const boundingRect = this.element.getBoundingClientRect();
    this.startX = boundingRect.left;
    this.currentX = this.startX;

    function step() {
      if (this.hitAt_ && this.currentX >= this.hitAt_) {
        this.hit();
        return this.resolver_();
      }

      this.currentX += 7;
      this.element.style.transform = `translateX(${this.currentX}px)`;

      requestAnimationFrame(step.bind(this));
    }
    requestAnimationFrame(step.bind(this));
  }

  hitAtY(hitAt) {
    this.hitAt_ = hitAt;
    // to be resolve when hit
    return new Promise((resolve, _) => {
      this.resolver_ = resolve;
    })
  }

  hit() {
    if (!this.hasHit_) {
      this.hasHit_ = true;

      requestAnimationFrame(() => {
        const translateX = this.element.getBoundingClientRect().left;
        document.documentElement.style.setProperty('--akabei-translate-x', translateX + 'px');
        // TODO(benoit) add some effect fomr akabei?
        this.element.classList.add('explode');
      });
    }
  }

  static remove(akabei) {
    akabei.element.remove();
    akabei = null;
  }
}
