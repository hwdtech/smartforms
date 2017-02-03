import $ from 'jquery';

import template from './panel.jade';
import Base from '../base/base';
import Form from '../form/form';
import Factory from '../factory';
import './panel.css';

import configReader from '../../services/config_reader';

export default class Panel extends Base {
  get templateFn() {
    return template;
  }

  get form() {
    return this._form;
  }

  getTemplateData() {
    return Object.assign({}, this.config, {
      showLabel: !this.config.suppressLabel && this.config.label,
      parendId: this.parent.id
    });
  }

  constructor(config) {
    super(config);

    if (config.form) {
      const formConfig = configReader.createFormConfig(config.form);
      this._form = new Form({
        block: 'form',
        items: formConfig.items
      });
    }
  }

  render() {
    super.render();

    this._form.render();

    this.el.find('.form-wrapper form').append(this._form.el);
  }

  afterRender() {
    super.afterRender();

    this.el.find('.panel-heading').on('click', e => this._onTogglePanel(e));
    this.el.find('.form-delete').on('click', e => this._onRemove(e));
    this.el.find('.form-submit').on('click', e => this._onSubmit(e));
    this._form.afterRender();
  }

  _onTogglePanel(e) {
    const collapserTextEl = this.el.find('.panel-collapser span');

    return ($(e.currentTarget).attr('aria-expanded') !== 'true')
      ? collapserTextEl.text(this.config.collapserHideMessage)
      : collapserTextEl.text(this.config.collapserShowMessage);
  }

  _onRemove() {
    this.el.remove();
    this.trigger('afterRemove');
  }

  _onSubmit(e) {
    e.preventDefault();
    const isValid = this.form.validate();

    if (isValid) {
      // submit form
    }

    this.trigger('afterSubmitPanel', [isValid]);
  }
}

Factory.register('panel', Panel);
