import './blocks/actions/actions';
import './blocks/button/button';
import './blocks/checkbox/checkbox';
import './blocks/date/date';
import './blocks/fieldset/fieldset';
import './blocks/fieldset/fieldset_row';
import './blocks/input/input';
import './blocks/select/select';
import './blocks/static/static';
import './blocks/text/text';
import './blocks/label/label';
import './blocks/array/array_field';
import './blocks/divider/divider';
import './blocks/address/address';
import './blocks/radiogroup/radiogroup';
import './blocks/comment/comment';
import './blocks/link/link';
import './blocks/table/table';
import './blocks/radiogroup_with_containers/radiogroup_container';
import './blocks/radiogroup_with_containers/radiogroup_with_containers';
import './blocks/check_group_list/check_group_list';
import './blocks/check_group_list_item/check_group_list_item';
import './blocks/image_group/image_group';
import './blocks/panel/panel';
import './blocks/panel_group/panel_group';
import './blocks/text/paymentTag';
import './blocks/checkbox/checkbox_with_collapsed_container/checkbox_with_collapsed_container';
import './blocks/information_modal_container/success_payment_modal_container';
import './blocks/success_payment_modal_body/modal_body';
import './blocks/success_payment_modal_header/modal_header';
import './blocks/receipt_modal_body/modal_body';
import './blocks/receipt_modal_footer/modal_footer';

import Modal from './blocks/modal/modal';
import SuccessPaymentModal from './blocks/modal/success_payment_modal';
import ReceiptModal from './blocks/modal/receipt_modal';
import Form from './blocks/form/form';

import configReader from './services/config_reader';
import './services/mask_initializer';

function createForm(el, config, globalConfig) {
  const form = new Form(configReader.createFormConfig(config, globalConfig));

  form.render();

  el.replaceWith(form.el);

  form.afterRender();

  return form;
}

function createModal(el, config, globalConfig) {
  const modal = new Modal(configReader.createModalConfig(config, globalConfig));

  modal.render();

  el.replaceWith(modal.el);

  modal.afterRender();

  return modal;
}

function createSuccessPaymentModal(el, config) {
  const modal = new SuccessPaymentModal(config);

  modal.render();

  el.replaceWith(modal.el);

  modal.afterRender();

  return modal;
}

function createReceiptModal(el, config) {
  const modal = new ReceiptModal(config);

  modal.render();

  el.replaceWith(modal.el);

  modal.afterRender();

  return modal;
}

module.exports = {
  createForm,
  createModal,
  createSuccessPaymentModal,
  createReceiptModal
};
