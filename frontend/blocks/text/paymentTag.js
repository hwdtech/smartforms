import 'bootstrap-tagsinput';
import Bloodhound from 'typeahead.js';
import $ from 'jquery';

import template from './paymentTag.jade';
import './paymentTag.css';

import Input from '../input/input';
import Factory from '../factory';

export default class TagInput extends Input {
  afterRender() {
    super.afterRender();

    const dataMain = this.config.dataMain;
    const services = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: dataMain.alllabels
    });
    services.initialize();

    this._input.tagsinput({
      maxTags: dataMain.paymentcountlimit,
      maxChars: 50,
      typeaheadjs: {
        name: 'labels',
        displayKey: 'name',
        valueKey: 'name',
        source: services.ttAdapter()
      }
    });

    this._input.tagsinput('input').on('blur', () => {
      this._input.tagsinput('add', this._input.tagsinput('input').val().trim());
    });

    this._input.on('beforeItemAdd', event => {
      const userLabelsCount = dataMain.totaluserlabelcount;
      const maxLabelCount = dataMain.labelscountlimit;
      let alllabels = dataMain.alllabels;

      alllabels = alllabels.map(elem => elem.name.toLowerCase());
      if (userLabelsCount === maxLabelCount && $.inArray(event.item.toLowerCase(), alllabels) === -1) {
        // eslint-disable-next-line no-param-reassign
        event.cancel = true;
      }
    });

    this._input.on('itemAdded', () => {
      this._input.tagsinput('input').typeahead('val', '');
    });

    return this._input;
  }

  get value() {
    return {
      [this.config.name]: this._input.val() || ''
    };
  }

  set value(val) {
    this._input.tagsinput('add', val.trim());
    $(this).val('');
  }

  get templateFn() {
    return template;
  }
}

Factory.register('tagInput', TagInput);
