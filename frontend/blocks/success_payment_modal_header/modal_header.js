import template from './modal_header.jade';
import './modal_header.css';

import Base from '../base/base';
import Factory from '../factory';

export default class SuccessPaymentModalHeader extends Base {
  get templateFn() {
    return template;
  }

  afterRender() {
    super.afterRender();

    this.el.find('a.show-receipt').on('click', () => this.trigger('show-receipt'));
  }
}

Factory.register('successPaymentModalHeader', SuccessPaymentModalHeader);
