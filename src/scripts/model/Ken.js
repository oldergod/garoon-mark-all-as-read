'use strict';
/**
 * @fileoverview Ken
 */

export default class Ken {
  constructor() {
    this.hado_;

    this.registerKeyboardShortcuts_();

    this.bodyInterval_;
  }

  createDom() {
    var el = goog.soy.renderAsElement(gaia.argoui.osf.ken.soy.div, {
      divClass: 'ken stance'
    }, null, this.getDomHelper());
    this.setElementInternal(el);
  }

  registerKeyboardShortcuts_() {
    var hotKey = gaia.argoui.Hotkey.create();
    var keyCodes = goog.events.KeyCodes;
    cybozu.ui.hotkeyContainer.add(hotKey);
    hotKey.register(keyCodes.RIGHT, this.handleInputRight_, {
      scope: this,
      repeatable: true,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.LEFT, this.handleInputLeft_, {
      scope: this,
      repeatable: true,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.UP, this.handleInputUp_, {
      scope: this,
      repeatable: true,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.DOWN, this.handleInputDown_, {
      scope: this,
      repeatable: true,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.SPACE, this.handleInputSpace_, {
      scope: this,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.Q, this.handleInputQ_, {
      scope: this,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.W, this.handleInputW_, {
      scope: this,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.E, this.handleInputE_, {
      scope: this,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.A, this.handleInputA_, {
      scope: this,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.S, this.handleInputS_, {
      scope: this,
      cancelOnTyping: true
    });
    hotKey.register(keyCodes.D, this.handleInputD_, {
      scope: this,
      cancelOnTyping: true
    });
    hotKey.generateHelp('js.cybozu.page.ntf.keyboard');
    hotKey.start();
  }

  static get ACTIONS() {
    return {
      PUNCH: {
        className: 'punch',
        duration: 150,
        hitAction: true,
        jumpAction: false,
        soundName: 'huh1'
      },
      KICK: {
        className: 'kick',
        duration: 500,
        hitAction: true,
        jumpAction: false,
        soundName: 'huh3'
      },
      REVERSEKICK: {
        className: 'reversekick',
        duration: 500,
        hitAction: true,
        jumpAction: false,
        soundName: 'huh2'
      },
      TATSUMAKI: {
        className: 'tatsumaki',
        duration: 2000,
        jumpAction: true,
        hitAction: true,
        soundName: 'tatsumaki'
      },
      HADOKEN: {
        className: 'hadoken',
        duration: 500,
        jumpAction: false,
        hitAction: true,
        soundName: 'hado'
      },
      SHORYUKEN: {
        className: 'shoryuken',
        duration: 1000,
        jumpAction: true,
        hitAction: true,
        soundName: 'shoryu'
      },
      JUMP: {
        className: 'jump',
        duration: 900,
        jumpAction: true,
        hitAction: true,
        soundName: undefined
      }
    }
  }

  static get WALK() {
    return {
      RIGHT: 1,
      LEFT: 2,
      UP: 3,
      DOWN: 4
    }
  }

  handleInputRight_() {
    this.walk_(gaia.argoui.osf.Ken.WALK.RIGHT);
  }

  handleInputLeft_() {
    this.walk_(gaia.argoui.osf.Ken.WALK.LEFT);
  }

  handleInputUp_() {
    this.walk_(gaia.argoui.osf.Ken.WALK.UP);
  }

  handleInputDown_() {
    this.walk_(gaia.argoui.osf.Ken.WALK.DOWN);
  }

  walk_(orientation) {
    var element = this.getElement();
    goog.dom.classlist.add(element, 'walk');
    //.css({ marginLeft:'+=10px' });
    var matrix = goog.style.getComputedStyle(element, 'transform');
    var _array = matrix.split(', ');
    var x = parseInt(_array[_array.length - 2], 10);
    var y = parseInt(_array[_array.length - 1], 10);
    switch (orientation) {
      case gaia.argoui.osf.Ken.WALK.LEFT:
        x -= 10;
        break;
      case gaia.argoui.osf.Ken.WALK.UP:
        y -= 7;
        break;
      case gaia.argoui.osf.Ken.WALK.RIGHT:
        x += 10;
        break;
      case gaia.argoui.osf.Ken.WALK.DOWN:
        y += 7;
        break;
    }
    element.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    if (this.bodyInterval_ > 0) {
      clearInterval(this.bodyInterval_);
    }
    this.bodyInterval_ = setTimeout(function() {
      goog.dom.classlist.remove(element, 'walk');
    }, 50);
  }

  handleInputQ_() {
    this.applyAction_(gaia.argoui.osf.Ken.ACTIONS.REVERSEKICK);
  }

  handleInputSpace_() {
    this.applyAction_(gaia.argoui.osf.Ken.ACTIONS.JUMP);
  }

  handleInputW_() {
    this.applyAction_(gaia.argoui.osf.Ken.ACTIONS.TATSUMAKI);
  }

  handleInputE_() {
    this.applyAction_(gaia.argoui.osf.Ken.ACTIONS.SHORYUKEN);
  }

  handleInputA_() {
    this.applyAction_(gaia.argoui.osf.Ken.ACTIONS.KICK);
  }

  handleInputS_() {
    this.applyAction_(gaia.argoui.osf.Ken.ACTIONS.HADOKEN);
  }

  handleInputD_() {
    this.applyAction_(gaia.argoui.osf.Ken.ACTIONS.PUNCH);
  }

  static get DOWN() {
    return 'down'
  }

  static get MOVING() {
    return 'moving';
  }

  applyAction_(action) {
    var self = this;
    var element = self.getElement();
    if (goog.array.contains(goog.dom.classlist.get(element), gaia.argoui.osf.Ken.MOVING)) {
      return;
    }
    switch (action) {
      case gaia.argoui.osf.Ken.ACTIONS.HADOKEN:
        setTimeout(function() {
          self.createAndRenderHado_();
        }, 250);
        break;
    }
    if (action.hitAction) {
      var attackInterval = setInterval(function() {
        self.dispatchEvent(new gaia.argoui.osf.AttackEvent(self));
      }, 100);
      setTimeout(function() {
        clearInterval(attackInterval);
      }, action.duration * 0.8);
    }

    goog.dom.classlist.addAll(element, [gaia.argoui.osf.Ken.MOVING, action.className]);
    if (action.jumpAction) {
      setTimeout(function() {
        goog.dom.classlist.add(element, gaia.argoui.osf.Ken.DOWN);
      }, action.duration - 500);
    }
    if (action.soundName) {
      gaia.argoui.osf.Ken.playSound(action.soundName);
    }
    setTimeout(function() {
      if (action.jumpAction) {
        goog.dom.classlist.remove(element, gaia.argoui.osf.Ken.DOWN);
      }
      goog.dom.classlist.removeAll(element, [gaia.argoui.osf.Ken.MOVING, action.className]);
    }, action.duration);
  }

  removeClass_(className) {
    goog.dom.classlist.remove(this.getElement(), className);
  }

  createAndRenderHado_() {
    this.hado_ = new gaia.argoui.osf.Hado(this);
    this.hado_.render(this.getElement());
  }

  getOffset() {
    return this.getElement().getBoundingClientRect();
    //return goog.style.getPageOffset(this.getElement());
  }

  static get ATTACK_EVENT() {
    return 'ken_attack_event';
  }
