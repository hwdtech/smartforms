import Container from '../container/container';
import template from './receipt_modal_container.jade';
import Factory from '../factory';

export default class ReceiptModalContainer extends Container {
  get templateFn() {
    return template;
  }

  afterRender() {
    super.afterRender();

    this.items.forEach(item => {
      item.on('vp-subbmit', () => {
        this.trigger('vp-subbmit');
      });
    });
  }

  appendChild(block) {
    this.el.append(block.el);
  }
}

Factory.register('receiptModalContainer', ReceiptModalContainer);
