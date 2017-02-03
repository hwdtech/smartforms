import template from './modal_footer.jade';
import './modal_footer.css';

import Base from '../base/base';
import Factory from '../factory';

export default class ReceiptModalFooter extends Base {
  get templateFn() {
    return template;
  }

  afterRender() {
    super.afterRender();

    this.el.find('button.go-to-url').on('click', () => window.open(this.config.link));
  }
}

Factory.register('receiptModalFooter', ReceiptModalFooter);
