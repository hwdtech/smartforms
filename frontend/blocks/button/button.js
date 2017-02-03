import template from './button.jade';

import Base from '../base/base';
import Factory from '../factory';

import './button.css';

export default class Button extends Base {
  get templateFn() {
    return template;
  }

  afterRender() {
    super.afterRender();

    this._buttonEl = this.el.find('button');
  }

  disable() {
    this._buttonEl.prop('disabled', true);
  }

  enable() {
    this._buttonEl.prop('disabled', false);
  }
}

Factory.register('button', Button);
