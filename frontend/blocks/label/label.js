import template from './label.jade';
import './label.css';

import Base from '../base/base';
import Factory from '../factory';

export default class Label extends Base {
  get templateFn() {
    return template;
  }

  get dataText() {
    return this.el.data('text');
  }
}

Factory.register('label', Label);
