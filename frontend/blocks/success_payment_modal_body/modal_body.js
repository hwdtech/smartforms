import template from './modal_body.jade';
import './modal_body.css';

import Base from '../base/base';
import Factory from '../factory';

export default class SuccessPaymentModalBody extends Base {
  get templateFn() {
    return template;
  }

  afterRender() {
    super.afterRender();

    this.el.find('button.go-to-url').on('click', () => this.trigger('vp-subbmit'));
  }
}

Factory.register('successPaymentModalBody', SuccessPaymentModalBody);
