import 'jquery.formstyler';

import template from './radiogroup_with_containers.jade';

import './radiogroup_with_containers.css';
import RadioGroup from '../radiogroup/radiogroup';
import Factory from '../factory';

export default class RadioGroupWithContainers extends RadioGroup {
  constructor(config) {
    super(config);

    this.containerOptions = {};
    const ContainerCtor = Factory.get('radiogroupcontainer');
    config.options.forEach(option => {
      this.containerOptions[option.value] = new ContainerCtor({ items: config.containerOptions[option.value] });
    });
  }

  get templateFn() {
    return template;
  }

  getTemplateData() {
    const result = super.getTemplateData();

    result.containerOptions = this.containerOptions;

    return result;
  }

  get sum() {
    return this.activeContainer.items.reduce((acc, block) => {
      const value = block.value || {};

      return acc + (parseFloat(value[block.name]) || 0);
    }, 0);
  }

  get value() {
    const checkedItem = this.el.find(`input:radio[name ='${this.config.name}']:checked`) || [];
    const result = this.activeContainer.items.reduce((acc, block) => Object.assign(acc, block.value), {});

    Object.assign(result, {
      [this.config.name]: (checkedItem && checkedItem.val) ? checkedItem.val() : null
    });

    return this.config.name ? { [this.config.name]: result } : result;
  }

  set value(val) {
    this.el.find(`input[name="${this.config.name}"][value="${val[this.config.name]}"]`).prop('checked', true).change();
    this._radioButtons.trigger('refresh');

    Object.keys(val).filter(fieldName => fieldName !== this.config.name).forEach(fieldName => {
      this.activeContainer.getItemByName(fieldName).value = val[fieldName];
    });
  }

  get activeContainer() {
    const checkedItem = this.el.find(`input:radio[name ='${this.config.name}']:checked`) || [];
    const checkedItemValueExist = checkedItem && checkedItem.val;

    return checkedItemValueExist ? this.containerOptions[checkedItem.val()] : [];
  }

  render() {
    super.render();

    this.config.options.forEach(option => {
      const container = this.containerOptions[option.value];

      container.render();
      this.el.find(`#${container.id}`).append(container.el);
    });
  }

  afterRender() {
    super.afterRender();

    this.config.options.forEach(option => {
      this.containerOptions[option.value].afterRender();
      this.containerOptions[option.value].on('change', () => this.trigger('change'));
    });

    if (!this.config.shouldNotDisable) {
      this.disableContainers();
      this.enableActiveContainer();
    }
  }

  disableContainers() {
    this.config.options.forEach(option => {
      this.containerOptions[option.value].disable();
    });
  }

  enableActiveContainer() {
    this.activeContainer.items.forEach((block, index) => {
      block.enable();
      if (index === 0) {
        block.focus();
      }
    });
  }

  onChange() {
    this.trigger('change');

    if (!this.config.shouldNotDisable) {
      this.disableContainers();
      this.enableActiveContainer();
    }
  }
}

Factory.register('radioGroupWithContainers', RadioGroupWithContainers);
