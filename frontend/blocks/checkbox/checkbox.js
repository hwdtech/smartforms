import 'jquery.formstyler';

import './checkbox.css';
import template from './checkbox.jade';

import Base from '../base/base';
import Factory from '../factory';

export default class Checkbox extends Base {
  get templateFn() {
    return template;
  }

  get value() {
    return {
      [this.config.name]: this._checkboxWrapper.prop('checked')
    };
  }

  set value(val) {
    this._checkboxWrapper.prop('checked', val);
    this._checkboxWrapper.trigger('refresh');
  }

  render() {
    super.render();

    this._checkboxWrapper = this.el.find(`#${this.id}`);
    this._checkboxWrapper.styler();
    this._checkboxWrapper.on('change', () => this.trigger('change', [this, this.value]));
  }

  afterRender() {
    this.el.find('a.popover-icon').popover();
  }
}

Factory.register('checkbox', Checkbox);
