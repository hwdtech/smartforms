import template from './input.jade';

import Base from '../base/base';
import Factory from '../factory';

import './input.css';

export default class Input extends Base {
  render() {
    super.render();

    this._input = this.el.find('input');
    this._input.on('change', () => this.trigger('change'));
  }

  afterRender() {
    this._popoverEl = this.el.find(`#${this.id}`);
    this._focusEl = this.el.find(`#${this.id}`);
    this._errorEl = this.el.find('.controls');
    this._disabledEl = this.el.find(`#${this.id}`);
    super.afterRender();

    this.el.find('a.new-form-link').on('click', e => {
      e.preventDefault();
      this.trigger('getNewForm', [{ url: this.config.newFormLink.formUrl, params: this.config.newFormLink.params }]);
    });
  }

  get templateFn() {
    return template;
  }

  get popoverEl() {
    return this._popoverEl;
  }

  get focusEl() {
    return this._focusEl;
  }

  get disabledEl() {
    return this._disabledEl;
  }

  get value() {
    return {
      [this.config.name]: this.el.find('input').val()
    };
  }

  set value(val) {
    this.el.find('input').val(val);
  }

  get errorEl() {
    return this._errorEl;
  }
}

Factory.register('input', Input);
