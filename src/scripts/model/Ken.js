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

  resetWalk(evt) {
    this.element.style.transition = 'initial';
    this.element.classList.remove(Ken.STANCES.MOVING, Ken.STANCES.WALK);
    this.element.removeEventListener('transitionend', this.resetWalk);

    evt.stopPropagation();
  }

  walkFromToX({from, to, duration}) {
    if (this.element.classList.contains(Ken.STANCES.MOVING)) {
      return;
    }
    this.element.classList.add(Ken.STANCES.MOVING, Ken.STANCES.WALK);

    this.element.style.transform = `translateX(${from}px)`;
    //
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.element.style.transition = `transform ${duration}ms linear`;
        this.element.style.transform = `translateX(${to}px)`;
      });
    });
    this.element.addEventListener('transitionend', this.resetWalk.bind(this));
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
    this.applyAction(Ken.ACTIONS.HADO);
  }

  punch() {
    this.applyAction(Ken.ACTIONS.PUNCH);
  }

  applyAction(action) {
    if (this.element.classList.contains(Ken.STANCES.MOVING)) {
      return;
    }
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
    setTimeout(() => {
      if (action.jumpAction) {
        this.element.classList.remove(Ken.STANCES.DOWN);
      }
      this.element.classList.remove(Ken.STANCES.MOVING, action.className);
    }, action.duration);
  }

  createAndRenderHadoken() {
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
