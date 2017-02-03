import 'jquery.formstyler';

import template from './radiogroup.jade';

import './radiogroup.css';
import Base from '../base/base';
import Factory from '../factory';

export default class RadioGroup extends Base {
  get templateFn() {
    return template;
  }

  get value() {
    const checkedItem = this.el.find(`input:radio[name ='${this.config.name}']:checked`) || [];

    return {
      [this.config.name]: (checkedItem && checkedItem.val) ? checkedItem.val() : null
    };
  }

  set value(val) {
    this.el.find(`input[name="${this.config.name}"][value="${val}"]`).prop('checked', true);
    this._radioButtons.trigger('refresh');
  }

  render() {
    super.render();

    this._radioButtons = this.el.find('input[type="radio"]');
    this._radioButtons.styler();

    this._radioButtons.on('change', () => this.onChange());
  }

  onChange() {
    this.trigger('change', [this, this.value]);
  }
}

Factory.register('radiogroup', RadioGroup);
