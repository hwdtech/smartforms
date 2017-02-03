import Container from '../container/container';
import template from './success_payment_modal_container.jade';
import Factory from '../factory';

export default class SuccessPaymentModalContainer extends Container {
  get templateFn() {
    return template;
  }

  afterRender() {
    super.afterRender();

    this.items.forEach(item => {
      item.on('show-receipt', () => {
        this.trigger('show-receipt');
      });
    });
  }

  appendChild(block) {
    this.el.append(block.el);
  }
}

Factory.register('successPaymentModalContainer', SuccessPaymentModalContainer);
