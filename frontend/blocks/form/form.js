import $ from 'jquery';
import forEach from 'lodash/forEach';

import Container from '../container/container';

import template from './form.jade';
import parser from '../../services/parser';

import './form.css';

export default class Form extends Container {
  get templateFn() {
    return template;
  }

  render() {
    super.render();

    this.items.forEach(block => {
      this.initBlockDependencies(block);
      this.initBlockSummarize(block);
    });
  }

  afterRender() {
    super.afterRender();

    this.formGlobalError = this.el.find('.form-global-error');
    this.on('showGlobalError', (e, errorMessage) => this.showError(errorMessage));
    this.el.find('.form-header a.new-form-link').on('click', e => {
      e.preventDefault();
      this.trigger('getNewForm', [this.config.formHeaderNewFormLink.formUrl]);
    });
    this.el.find('button[type=submit]').click(e => {
      e.preventDefault();
      const isValid = this.validate();
      this.trigger('vpFormSubmit', [this.value, isValid]);
    });
  }

  initBlockSummarize(block) {
    if (block.config.summarize && Array.isArray(block.config.summarize)) {
      block.config.summarize.forEach(fieldName => {
        const field = this.getItemByName(fieldName) || this.getItemByAlias(fieldName);
        field.on('change', () => this.changeSum(block));
      });

      this.changeSum(block);
    }
  }

  changeSum(block) {
    const summableContainers = [
      'array',
      'fieldset',
      'table',
      'radioGroupWithContainers',
      'checkGroupList'
    ];

    // eslint-disable-next-line no-param-reassign
    block.value = parseFloat(block.config.summarize.reduce((acc, fieldName) => {
      const field = this.getItemByName(fieldName) || this.getItemByAlias(fieldName);
      if (summableContainers.includes(field.config.block)) {
        return acc + field.sum;
      }

      return acc + (parseFloat(field.value[field.name]) || 0);
    }, 0)).toFixed(2);
  }

  initBlockDependencies(block) {
    if (block.config.dependencies) {
      const compiledDependencies = parser.parse(block.config.dependencies);

      compiledDependencies.identifiers.forEach(fieldName => {
        this.getItemByName(fieldName).on('change hide show', () => this.resolveDependencies(block, compiledDependencies));
      });

      this.resolveDependencies(block, compiledDependencies);
    }
  }

  onInitValueRule(block, rule) {
    const compiledValueRule = parser.parse(rule);

    compiledValueRule.identifiers.forEach(identifier => {
      const fieldName = identifier.split('.')[0];

      this.getItemByName(fieldName).on('change', () => {
        // eslint-disable-next-line no-param-reassign
        block.value = compiledValueRule.eval(this.context);
      });
    });
  }

  resolveDependencies(block, compiledDependencies) {
    const isResolved = compiledDependencies.eval(this.context);

    block[isResolved ? 'show' : 'hide']();
  }

  get value() {
    const result = {};

    this.items.filter(block => !block.isHidden).forEach(block => Object.assign(result, block.value));

    return this.config.name ? { [this.config.name]: result } : result;
  }

  set value(val) {
    // TODO realization of set value function
  }

  validate() {
    if (!this.config.validateAllBlocks) {
      return this.items.every(block => {
        const isValid = block.isHidden || block.validate();

        if (!isValid) {
          block.focus();
        }

        return isValid;
      });
    }

    return this.items.reduce((acc, block) => {
      const isValid = block.isHidden || block.validate();

      if (acc && !isValid) {
        block.focus();
      }

      return isValid && acc;
    }, true);
  }

  appendChild(block) {
    this.el.children('.form-content').append(block.el);
  }

  showErrors(errors) {
    forEach(errors, (errorMsg, fieldName) => {
      const field = this.getItemByName(fieldName);

      field.showErrorMessage(errorMsg);
    });
  }

  removeErrors() {
    super.removeErrors();

    this.hideError();
  }

  showError(errorMessage) {
    this.formGlobalError.append($(`<div class="alert alert-danger validation" role="alert">${errorMessage}</div>`));
  }

  hideError() {
    this.formGlobalError.empty();
  }
}
