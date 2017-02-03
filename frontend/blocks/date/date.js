import 'bootstrap-datepicker';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker3.css';
import 'bootstrap-datepicker/js/locales/bootstrap-datepicker.ru';
import './date.css';

import Base from '../base/base';
import Factory from '../factory';

import template from './date.jade';

export default class Date extends Base {
  get templateFn() {
    return template;
  }

  get value() {
    return {
      [this.config.name]: this._dateEl.find('input').val() || null
    };
  }

  set value(val) {
    this._dateEl.datepicker('setDate', val);
  }

  render() {
    super.render();

    this._dateEl = this.el.find('.date');

    if (this.config.value) {
      this.value = this.config.value;
    }
  }
}

Factory.register('date', Date);
