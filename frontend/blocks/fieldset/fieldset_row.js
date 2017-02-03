import $ from 'jquery';

import Container from '../container/container';

import rowTemplate from './fieldset_row.jade';
import colTemplate from './fieldset_col.jade';

import Factory from '../factory';

export default class FieldsetRow extends Container {
  get width() {
    return this.config.width;
  }

  get templateFn() {
    return rowTemplate;
  }

  appendChild(block) {
    const width = this.width && `col-xs-${this.width.shift()}`;
    this.el.append($(colTemplate({ width })).append(block.el));
  }

  afterRender() {
    super.afterRender();

    this.items.forEach(item => item.on('change', () => this.trigger('change')));
  }

  validate() {
    if (this.config.validateOnlyFirstField) {
      return this.items.every(block => {
        const isValid = block.validate();

        if (!isValid) {
          this.firstInvalidField = block;
        }

        return isValid;
      });
    }

    return this.items.reduce((acc, block) => {
      const isValid = block.validate();

      if (acc && !isValid) {
        this.firstInvalidField = block;
      }

      return isValid && acc;
    }, true);
  }

  focus() {
    this.firstInvalidField.focus();
  }

  hideErrors() {
    this.items.forEach(block => block.popover('hide'));
  }

  get sum() {
    return this.items.reduce((acc, block) => {
      if (!block.config.isSummable) {
        return acc;
      }

      const value = block.value || {};

      return acc + (parseFloat(value[block.name]) || 0);
    }, 0);
  }
}

Factory.register('fieldsetRow', FieldsetRow);
