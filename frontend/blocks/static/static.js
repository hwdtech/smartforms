import template from './static.jade';
import './static.css';

import Base from '../base/base';
import Factory from '../factory';

export default class Static extends Base {
  get templateFn() {
    return template;
  }

  get value() {
    return {
      [this.config.name]: this.el.find('.form-control-static').eq(0).html()
    };
  }

  set value(val) {
    this.el.find('.form-control-static').eq(0).html(val);
  }
}

Factory.register('static', Static);
