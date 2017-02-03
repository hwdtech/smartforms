import template from './modal_body.jade';
import './modal_body.css';

import Base from '../base/base';
import Factory from '../factory';

export default class ReceiptModalBody extends Base {
  get templateFn() {
    return template;
  }
}

Factory.register('receiptModalBody', ReceiptModalBody);
