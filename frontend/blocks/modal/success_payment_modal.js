import Base from '../base/base';
import Factory from '../factory';
import './success_payment_modal.css';
import template from './success_payment_modal.jade';
import InformationModalContainer from '../information_modal_container/success_payment_modal_container';

export default class SuccessPaymentModal extends Base {
  constructor(config) {
    super(config);

    this._blocksContainer = new InformationModalContainer({
      block: 'successPaymentModalContainer',
      items: this.config.items
    });
  }

  get templateFn() {
    return template;
  }

  render() {
    super.render();

    this._blocksContainer.render();

    this.el.find('.modal-body').append(this._blocksContainer.el);
  }

  afterRender() {
    super.afterRender();

    this._blocksContainer.afterRender();
    this._blocksContainer.on('vp-subbmit', () => this.trigger('vp-subbmit'));
    this._blocksContainer.on('show-receipt', () => this.trigger('show-receipt'));
  }
}

Factory.register('successPaymentModal', SuccessPaymentModal);
