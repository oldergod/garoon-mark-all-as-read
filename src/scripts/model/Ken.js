'use strict';

import Hadoken from './Hadoken';

export default class Ken {
  constructor(kenTop) {
    this.hadoken_ = null;
    this.bodyInterval_ = null;

    this.currentAction_ = null;
    this.resolver_ = null;

    this.resetWalkBound_ = this.resetWalk.bind(this);
    this.unapplyActionBound_ = this.unapplyAction.bind(this);

    if (kenTop) {
      document.documentElement.style.setProperty('--ken-top', kenTop + 'px');
    }
  }

  newAnimationIterationPromise() {
    // console.log('newAnimationIterationPromise', this, this.resolver_);
    return new Promise((resolve, _) => {
      this.resolver_ = () => {
        // console.log('it is resolved!');
        resolve(this.hadoken_);
      };
    });
  }

  resolveAnimationIterationPromise(evt) {
    // console.log('resolveAnimationIterationPromise', evt, this, this.resolver_);
    if (this.resolver_) {
      this.resolver_();
      this.resolver_ = null;
    }
  }

  newTransitionEndPromise() {
    // console.log('newTransitionEndPromise', this, this.resolver_);
    return new Promise((resolve, _) => {
      this.resolver_ = () => {
        // console.log('it is resolved!');
        resolve(this.hadoken_);
      };
    });
  }

  resolveTransitionEndPromise(evt) {
    // console.log('resolveTransitionEndPromise', evt, this, this.resolver_);
    if (this.resolver_) {
      this.resolver_();
      this.resolver_ = null;
    }
  }

  createDom() {
    this.element = document.createElement('div');
    this.element.classList.add('ken', 'stance');
    // this.element.addEventListener('transitionend', this.resolveTransitionEndPromise.bind(this));
    return this.element;
  }

  resetWalk(evt) {
    // console.log('resetWalk');
    this.element.style.transition = '';
    this.element.classList.remove(Ken.STANCES.MOVING, Ken.STANCES.WALK);
    this.element.removeEventListener('transitionend', this.resetWalkBound_);
    this.resolveTransitionEndPromise();

    evt.stopPropagation();
  }

  // TODO(benoit) try with requestAnimationFrame to see if render is better
  walkFromToX({
    from,
    to,
    duration
  }) {
    if (this.element.classList.contains(Ken.STANCES.MOVING)) {
      return;
    }
    this.element.classList.add(Ken.STANCES.MOVING, Ken.STANCES.WALK);

    const flipped = to < from;
    const scaleStyle = flipped ? ' scaleX(-1)' : '';
    this.element.style.transform = `translateX(${from}px)${scaleStyle}`;
    this.element.getBoundingClientRect();
    //
    requestAnimationFrame(() => {
      this.element.style.transition = `transform ${duration}ms linear`;
      this.element.style.transform = `translateX(${to}px)${scaleStyle}`;
    });
    this.element.addEventListener('transitionend', this.resetWalkBound_);

    return this.newTransitionEndPromise();
  }

  walkRight() {
    this.walk(Ken.WALKS.RIGHT);
  }

  walkLeft() {
    this.walk(Ken.WALKS.LEFT);
  }

  walkUp() {
    this.walk(Ken.WALKS.UP);
  }

  walkDown() {
    this.walk(Ken.WALKS.DOWN);
  }

  walk(orientation) {
    this.element.classList.add(Ken.STANCES.WALK);
    //.css({ marginLeft:'+=10px' });
    const matrix = window.getComputedStyle(this.element).getPropertyValue('transform');
    const _array = matrix.split(', ');
    let x = parseInt(_array[_array.length - 2], 10);
    let y = parseInt(_array[_array.length - 1], 10);
    switch (orientation) {
      case Ken.WALKS.LEFT:
        x -= 10;
        break;
      case Ken.WALKS.UP:
        y -= 7;
        break;
      case Ken.WALKS.RIGHT:
        x += 10;
        break;
      case Ken.WALKS.DOWN:
        y += 7;
        break;
    }
    this.element.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    if (this.bodyInterval_ > 0) {
      clearInterval(this.bodyInterval_);
    }
    this.bodyInterval_ = setTimeout(() => {
      this.element.classList.remove(Ken.STANCES.WALK);
    }, 50);
  }

  reverseKick() {
    return this.applyAction(Ken.ACTIONS.REVERSEKICK);
  }

  jump() {
    return this.applyAction(Ken.ACTIONS.JUMP);
  }

  tatsumaki() {
    return this.applyAction(Ken.ACTIONS.TATSUMAKI);
  }

  shoryuken() {
    return this.applyAction(Ken.ACTIONS.SHORYUKEN);
  }

  kick() {
    return this.applyAction(Ken.ACTIONS.KICK);
  }

  hadoken() {
    return this.applyAction(Ken.ACTIONS.HADO);
  }

  punch() {
    return this.applyAction(Ken.ACTIONS.PUNCH);
  }

  unapplyAction(evt) {
    if (!evt.target.classList.contains('ken')) {
      return;
    }

    const action = this.currentAction_;
    this.currentAction_ = null;
    // console.log('unapplying', action, evt);

    if (action.jumpAction) {
      this.element.classList.remove(Ken.STANCES.DOWN);
    }
    this.element.classList.remove(Ken.STANCES.MOVING, action.className);

    this.element.removeEventListener('animationiteration', this.unapplyActionBound_);
    this.resolveAnimationIterationPromise();

    evt.stopPropagation();
  }

  // TODO(benoit) return a promise
  applyAction(action) {
    if (this.element.classList.contains(Ken.STANCES.MOVING)) {
      //       console.log('tried to apply action but moving', action);
      return;
    }
    this.currentAction_ = action;
    this.element.classList.add(Ken.STANCES.MOVING, action.className);

    if (action.className === Ken.ACTIONS.HADO.className) {
      setTimeout(() => {
        this.createAndRenderHadoken();
      }, 250);
    }
    if (action.hitAction) {
      const attackInterval = setInterval(() => {
        // this.dispatchEvent(new AttackEvent(this));
      }, 100);
      setTimeout(() => {
        clearInterval(attackInterval);
      }, action.duration * 0.8); // TODO(benoit) what is this?
    }

    if (action.jumpAction) {
      setTimeout(() => {
        this.element.classList.add(Ken.STANCES.DOWN);
      }, action.duration - 500);
    }

    this.element.addEventListener('animationiteration', this.unapplyActionBound_);

    return this.newAnimationIterationPromise();
  }

  createAndRenderHadoken() {
    this.hadoken_ = new Hadoken(this);
    this.hadoken_.render();
  }

  getOffset() {
    return this.element.getBoundingClientRect();
  }

  static remove(ken) {
    ken.element.remove();
    ken = null;
  }

  static get ATTACK_EVENT() {
    return 'ken_attack_event';
  }

  static get ACTIONS() {
    return {
      PUNCH: {
        className: 'punch',
        duration: 150,
        hitAction: true,
        jumpAction: false,
      },
      KICK: {
        className: 'kick',
        duration: 500,
        hitAction: true,
        jumpAction: false,
      },
      REVERSEKICK: {
        className: 'reversekick',
        duration: 500,
        hitAction: true,
        jumpAction: false,
      },
      TATSUMAKI: {
        className: 'tatsumaki',
        duration: 2000,
        jumpAction: true,
        hitAction: true,
      },
      HADO: {
        className: 'hado',
        duration: 500,
        jumpAction: false,
        hitAction: true,
      },
      SHORYUKEN: {
        className: 'shoryuken',
        duration: 1000,
        jumpAction: true,
        hitAction: true,
      },
      JUMP: {
        className: 'jump',
        duration: 900,
        jumpAction: true,
        hitAction: true,
      }
    }
  }

  static get WALKS() {
    return {
      RIGHT: 1,
      LEFT: 2,
      UP: 3,
      DOWN: 4
    }
  }

  static get STANCES() {
    return {
      DOWN: 'down',
      MOVING: 'moving',
      WALK: 'walk',
    }
  }

  static get HEIGHT() {
    return '80';
  }
}
