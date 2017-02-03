import $ from 'jquery';

import cloneDeep from 'lodash/cloneDeep';
import defaults from 'lodash/defaults';
import uniqueId from 'lodash/uniqueId';

import parser from '../../services/parser';
import './base.css';

export default class Base {
  constructor(config) {
    this._el = null;
    this._parent = null;
    this._id = config.id || uniqueId();
    this._config = cloneDeep(config);
  }

  render() {
    const tplData = defaults(this.getTemplateData(), this.templateDefaults);

    this._el = $(this.templateFn(tplData));
  }

  afterRender() {
    if (!Array.isArray(this.config.validationRules)) {
      return;
    }

    this.compiledRules = this.config.validationRules.map(rule => Object.assign({
      compiledRule: parser.parse(rule.rule)
    }, rule));
  }

  get context() {
    let parent = this.parent;

    while (parent && parent.parent !== null) {
      parent = parent.parent;
    }

    return Object.assign({ fieldName: this.name }, (parent && parent.value) || this.value);
  }

  validate() {
    if (!this.checkCompiledRules()) {
      return false;
    }
    this.popover('destroy');
    this._popoverExist = false;
    this.removeErrorClass();

    return true;
  }

  checkCompiledRules() {
    if (!this.compiledRules) {
      return true;
    }

    const invalidRule = this.compiledRules.find(rule => !rule.compiledRule.eval(this.context));

    if (!invalidRule) {
      return true;
    }

    if (!invalidRule.isGlobalError) {
      this.showErrorMessage(invalidRule.errorMessage);
    } else {
      this.trigger('showGlobalError', invalidRule.errorMessage);
    }

    return false;
  }

  showErrorMessage(message) {
    this.errorMessage = message;
    if (!this._popoverExist) {
      this.popover({
        placement: this.config.popoverPlacement || 'top',
        content: this.getErrorMessageFn(),
        trigger: 'focus'
      });
      this._popoverExist = true;
    }
    this.addErrorClass();
  }

  removeErrors() {
    if (this._popoverExist) {
      this.popover('destroy');
      this._popoverExist = false;
      this.removeErrorClass();
    }
  }

  on(...args) {
    $(this).on(...args);

    return this;
  }

  trigger(...args) {
    $(this).trigger(...args);

    return this;
  }

  hide() {
    if (this.isHidden) {
      return;
    }

    this._isHidden = true;
    this.el.hide();
    this.trigger('hide', this);
  }

  show() {
    if (!this.isHidden) {
      return;
    }

    this._isHidden = false;
    this.el.show();
    this.trigger('show', this);
  }

  initBlockValueRule() {
    if (!this.config.valueRule) {
      return;
    }

    this.trigger('initValueRule', [this, this.config.valueRule]);
  }

  get isHidden() {
    return this._isHidden;
  }

  get isValid() {
    return true;
  }

  get value() {
    return {};
  }

  get el() {
    return this._el;
  }

  set el(e) {
    this._el = e;
  }

  get config() {
    return this._config;
  }

  get parent() {
    return this._parent;
  }

  set parent(p) {
    this._parent = p;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.config.name;
  }

  getErrorMessageFn() {
    return () => this.errorMessage;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(message) {
    this._errorMessage = message;
  }

  getTemplateData() {
    return Object.assign({}, this.config, {
      showLabel: !this.config.suppressLabel && this.config.label
    });
  }

  get popoverEl() {
    return this.el;
  }

  get disabledEl() {
    return this.el;
  }

  get focusEl() {
    return this.el;
  }

  focus() {
    this.focusEl.focus();
  }

  disable() {
    this.disabledEl.prop('disabled', true);
  }

  enable() {
    this.disabledEl.prop('disabled', false);
  }

  popover(opt) {
    this.popoverEl.popover(opt);
  }

  get templateDefaults() {
    return {
      _prefix: 'smartforms',
      id: this.id,
      cls: '',
      value: '',
      required: false,
      readOnly: false,
      disabled: false,
      append: null,
      prepend: null,
      helpMessage: {
        fontColor: '#96a7b7',
        fontSize: '14'
      },
      placeholder: null,
      suppressLabel: false
    };
  }

  get errorEl() {
    return this.el;
  }

  addErrorClass() {
    this.errorEl.addClass('has-error');
  }

  removeErrorClass() {
    this.errorEl.removeClass('has-error');
  }

  isContainer() {
    return false;
  }
}
