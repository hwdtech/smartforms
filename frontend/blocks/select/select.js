import $ from 'jquery';
import 'jquery.formstyler';

import './select.css';
import optionTemplate from './option.jade';
import template from './select.jade';

import Base from '../base/base';
import Factory from '../factory';

export default class Select extends Base {
  get templateFn() {
    return template;
  }

  get value() {
    return {
      [this.config.name]: this._select.options[this._select.selectedIndex].value
    };
  }

  set value(val) {
    this._select.value = val;
    this._selectWrapper.trigger('refresh');
  }

  get name() {
    return this.config.name;
  }

  get nameOfValue() {
    return this._select.options[this._select.selectedIndex].innerHTML;
  }

  render() {
    super.render();

    this._selectWrapper = this.el.find(`#${this.id}`);
    this._select = this._selectWrapper[0];
    this._selectWrapper.styler();

    if (this.config && this.config.value) {
      this.value = this.config.value;
    }

    this._selectWrapper.on('change', () => this.trigger('change', [this, this.value]));
  }

  disable() {
    this._selectWrapper.prop('disabled', true);
    this._selectWrapper.trigger('refresh');
  }

  enable() {
    this._selectWrapper.prop('disabled', false);
    this._selectWrapper.trigger('refresh');
  }

  removeOptionByValue(val) {
    this.el.find(`option[value='${val}']`).remove();
    this._selectWrapper.trigger('refresh');
  }

  addOption(opt) {
    this._selectWrapper.append($(optionTemplate({
      value: opt.value,
      name: opt.text
    })));
    this._selectWrapper.trigger('refresh');
  }

  sortOptionsByText() {
    const options = this.el.find('option');
    const arr = options.map(function () {
      return {
        text: this.text,
        value: this.value
      };
    });

    arr.sort((option1, option2) => String.prototype.localeCompare.call(option1.text, option2.text));
    options.each(function (i) {
      this.value = arr[i].value;
      this.text = arr[i].text;
    });
    this._selectWrapper.trigger('refresh');
  }
}

Factory.register('select', Select);
