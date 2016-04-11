'use strict';

import Hadoken from './Hadoken';

export default class Ken {
  constructor() {
    this.hadoken_;

    this.bodyInterval_;
  }

  createDom() {
    this.element = document.createElement('div');
    this.element.classList.add('ken', 'stance');
    return this.element;
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
      HADOKEN: {
        className: 'hadoken',
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
    this.element.classList.add('walk');
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
      this.element.classList.remove(Ken.WALK);
    }, 50);
  }

  reverseKick() {
    this.applyAction(Ken.ACTIONS.REVERSEKICK);
  }

  jump() {
    this.applyAction(Ken.ACTIONS.JUMP);
  }

  tatsumaki() {
    this.applyAction(Ken.ACTIONS.TATSUMAKI);
  }

  shoryuken() {
    this.applyAction(Ken.ACTIONS.SHORYUKEN);
  }

  kick() {
    this.applyAction(Ken.ACTIONS.KICK);
  }

  hadoken() {
    this.applyAction(Ken.ACTIONS.HADOKEN);
  }

  punch() {
    this.applyAction(Ken.ACTIONS.PUNCH);
  }

  applyAction(action) {
    if (this.element.classList.contains(Ken.MOVING)) {
      return;
    }
    if (action.className === Ken.ACTIONS.HADOKEN.className) {
      setTimeout(() => {
        this.createAndRenderHado();
      }, 250);
    }
    if (action.hitAction) {
      const attackInterval = setInterval(() => {
        // this.dispatchEvent(new AttackEvent(this));
      }, 100);
      setTimeout(() => {
        clearInterval(attackInterval);
      }, action.duration * 0.8);
    }

    this.element.classList.add(Ken.MOVING, action.className);
    if (action.jumpAction) {
      setTimeout(() => {
        this.element.classList.add(Ken.DOWN);
      }, action.duration - 500);
    }
    setTimeout(() => {
      if (action.jumpAction) {
        this.element.classList.remove(Ken.DOWN);
      }
      this.element.classList.remove(Ken.MOVING, action.className);
    }, action.duration);
  }

  createAndRenderHado() {
    this.hadoken_ = new Hadoken(this);
    this.hadoken_.render();
  }

  getOffset() {
    return this.element.getBoundingClientRect();
  }

  static get ATTACK_EVENT() {
    return 'ken_attack_event';
  }
}
