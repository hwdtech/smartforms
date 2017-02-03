import Base from '../base/base';
import Factory from '../factory';
import './receipt_modal.css';
import template from './receipt_modal.jade';
import InformationModalContainer from '../receipt_modal_container/receipt_modal_container';

export default class ReceiptModal extends Base {
  constructor(config) {
    super(config);

    this._blocksContainer = new InformationModalContainer({
      block: 'receiptModalContainer',
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
  }
}

Factory.register('receiptModal', ReceiptModal);
