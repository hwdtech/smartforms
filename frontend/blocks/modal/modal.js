import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';
import $ from 'jquery';

import Base from '../base/base';
import Factory from '../factory';

import Form from '../form/form';
import PanelGroup from '../panel_group/panel_group';

import template from './modal.jade';
import helpTemplate from './help_modal.jade';
import './modal.css';
import protectedConnectionLogo from '../../images/protected_connection.png';
import bonusLogo from '../../images/bonus.png';
import bonusNotificationContent from './bonus_notification.jade';

import parser from '../../services/parser';
import configReader from '../../services/config_reader';

export default class Modal extends Base {
  constructor(config) {
    const finalConfig = cloneDeep(config);

    const iagreeContainer = (finalConfig.iagree && finalConfig.iagree.container)
      ? finalConfig.iagree.container
      : 'footer';

    const submitButtonContainer = (finalConfig.submitButton && finalConfig.submitButton.container)
      ? finalConfig.submitButton.container
      : (iagreeContainer || 'footer');

    const imageGroupContainer = (finalConfig.imageGroup && finalConfig.imageGroup.container)
      ? finalConfig.imageGroup.container
      : (iagreeContainer || 'footer');

    if (finalConfig.iagree) {
      finalConfig.iagreeId = uniqueId();
      finalConfig.iagree = Object.assign({
        block: 'checkbox',
        checkboxCls: 'iagree',
        name: 'iagree',
        checked: true,
        id: finalConfig.iagreeId,
        labelWidth: 3
      }, finalConfig.iagree);
      finalConfig[iagreeContainer].push(finalConfig.iagree);
    }

    if (finalConfig.imageGroup) {
      finalConfig.imageGroupId = uniqueId();
      finalConfig.imageGroup = Object.assign({
        block: 'imageGroup',
        id: uniqueId()
      }, finalConfig.imageGroup);
      finalConfig[imageGroupContainer].push(finalConfig.imageGroup);
    }

    if (finalConfig.submitButton) {
      finalConfig.submitButtonId = uniqueId();
      finalConfig.submitButton = Object.assign({
        block: 'button',
        type: 'submit',
        label: 'Submit',
        cls: 'btn-primary',
        id: finalConfig.submitButtonId,
        labelWidth: 3
      }, finalConfig.submitButton);
      finalConfig[submitButtonContainer].push(finalConfig.submitButton);
    }

    if (finalConfig.protectedConnection) {
      finalConfig.protectedConnection = Object.assign({
        text: 'Защищенное соединение',
        imgUrl: protectedConnectionLogo,
        color: '#4eae37'
      }, finalConfig.protectedConnection);
    }

    if (finalConfig.bonusNotification) {
      finalConfig.bonusNotification = Object.assign({
        text: 'Бонусы за каждую оплату!',
        content: bonusNotificationContent(),
        imgUrl: bonusLogo
      }, finalConfig.bonusNotification);
      finalConfig.bonusNotificationId = `bonus-notification-${uniqueId()}`;
    }

    super(finalConfig);

    if (!this.config.isPanelGroup) {
      this._bodyForm = new Form({
        block: 'form',
        items: this.config.body,
        formHeader: this.config.formHeader,
        formHeaderNewFormLink: this.config.formHeaderNewFormLink,
        validateAllBlocks: this.config.validateAllBlocks
      });
    } else {
      this._bodyForm = new PanelGroup({
        block: 'panelGroup',
        items: this.config.body
      });
    }

    this._footerForm = new Form({
      block: 'form',
      cls: 'form form-horizontal',
      items: this.config.footer,
      validateAllBlocks: this.config.validateAllBlocks
    });
  }

  get templateFn() {
    return template;
  }

  validate() {
    this._bodyForm.removeErrors();
    this._footerForm.removeErrors();

    return this._bodyForm.validate() && this._footerForm.validate();
  }

  get isValid() {
    return this._bodyForm.isValid && this._footerForm.isValid;
  }

  get value() {
    return Object.assign(this._bodyForm.value, this._footerForm.value);
  }

  set value(value) {
    Object.keys(value)
      .forEach(fieldName => {
        const field = this._bodyForm.getItemByName(fieldName) || this._footerForm.getItemByName(fieldName);

        if (!field) {
          return;
        }

        field.value = value[fieldName];
      });
  }

  render() {
    super.render();

    this._bodyForm.render();
    this._footerForm.render();

    this.el.find('.modal-body').append(this._bodyForm.el);
    this.el.find('.modal-footer').append(this._footerForm.el);
  }

  afterRender() {
    this.el.find('button[type=submit]').click(e => this._onSubmit(e));
    this._bodyForm.afterRender();
    this._footerForm.afterRender();
    this.modalTitle = this.el.find('.header-title h4');

    const iagree = this.el.find(`input#${this.config.iagreeId}`);
    const submitButton = this.el.find(`button#${this.config.submitButtonId}`);

    if (Array.isArray(this.config.titleDependencies)) {
      this.config.titleDependencies.forEach(titleDependency => {
        const compiledDependencies = parser.parse(titleDependency.dependencies);

        compiledDependencies.identifiers.forEach(fieldName => {
          this._bodyForm.getItemByName(fieldName).on('change', () => (
            this.resolveTitleDependencies(titleDependency.title, compiledDependencies)
          ));
        });

        this.resolveTitleDependencies(titleDependency.title, compiledDependencies);
      });
    }

    iagree.on('change', () => {
      submitButton.prop('disabled', () => !iagree.prop('checked'));
    }).change();

    if (this.config.help) {
      this.el.find('.modal-help a').on('click', () => {
        const helpModalTemplate = helpTemplate(Object.assign(this.getTemplateData(), this.templateDefaults));

        this.el.after(helpModalTemplate);

        const helpModal = $(`#help_modal_${this.id}`);
        helpModal.on('hidden.bs.modal', () => helpModal.remove());
      });
    }

    if (this.config.bonusNotificationId) {
      const bonusNotification = this.el.find(`.${this.config.bonusNotificationId}`);
      bonusNotification.popover({
        placement: 'top',
        trigger: 'focus',
        content: this.config.bonusNotification.content,
        html: true
      });
    }

    this._bodyForm.on('getNewForm', (e, formUrl) => this._onGetNewForm(formUrl));
    this._bodyForm.on('afterSubmitPanel', (e, isValid, formValue, panelName) => (
      this.trigger('afterSubmitPanel', [isValid, formValue, panelName])
    ));
    this._bodyForm.on('afterRemove', (e, panelName) => this.trigger('afterRemove', panelName));
  }

  _onSubmit(e) {
    e.preventDefault();
    const isValid = this.validate();

    if (isValid) {
      // submit form
    }

    this.trigger('afterSubmit', [isValid, this.value]);
  }

  resolveTitleDependencies(title, compiledDependencies) {
    const isResolved = compiledDependencies.eval(this.context);

    if (isResolved) {
      this.modalTitle.html(title);
    }
  }

  _onGetNewForm(formUrl) {
    $.get(formUrl.url, formUrl.params, config => {
      const modal = new Modal(configReader.createModalConfig(config.form));

      modal.render();

      this.el.after(modal.el);
      this.el.modal('hide');
      this.el.on('hidden.bs.modal', () => {
        this.el.remove();
        modal.afterRender();
        this.trigger('newModalHasBeenCreated', [modal.el, config.schema, modal]);
        modal.el.modal('show');
      });
    });
  }
}

Factory.register('modal', Modal);
