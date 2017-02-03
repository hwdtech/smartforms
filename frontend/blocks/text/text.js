import 'jquery.maskedinput/src/jquery.maskedinput';

import Input from '../input/input';
import Factory from '../factory';

import './text.css';

export default class Text extends Input {
  render() {
    super.render();

    this._input.mask(this.config.mask, { placeholder: this.config.maskPlaceholder });
    this._input.addClass(`text-align-${this.config.textAlign || 'left'}`);
    this._input.on('input', () => this.trigger('change'));
  }

  get value() {
    return {
      [this.config.name]: !this.config.returnNumber ? this._input.val() : parseFloat(this._input.val()) || 0
    };
  }

  set value(val) {
    this._input.val(val);
  }

  get name() {
    return this.config.name;
  }

  getTemplateData() {
    return Object.assign(super.getTemplateData(), { type: 'text' });
  }
}

Factory.register('text', Text);
