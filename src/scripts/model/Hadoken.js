'use strict';

export default class Hadoken {
  constructor(ken) {
    this.ken_ = ken;
    this.hasHit_ = false;
    this.hitAt_ = null;
    this.resolver_ = null;
    this.currentX = 90;
    this.startX = 0;
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

    const boundingRect = this.element.getBoundingClientRect();
    this.startX = boundingRect.left;

    function step() {
      if (this.hitAt_ && (this.startX + this.currentX) > this.hitAt_) {
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
        this.element.classList.add('explode');
      });
    }
  }
}
