import Container from '../container/container';
import Factory from '../factory';
import template from './radiogroup_container.jade';

export default class RadioGroupContainer extends Container {
  afterRender() {
    super.afterRender();

    this.items.forEach(block => block.on('change', () => this.trigger('change')));
  }

  get templateFn() {
    return template;
  }

  getTemplateData() {
    const result = super.getTemplateData();

    result.items = this.items;

    return result;
  }

  appendChild(block) {
    this.el.find(`#${block.id}`).append(block.el);
  }

  disable() {
    this.items.forEach(block => block.disable());
  }

  enable() {
    this.items.forEach(block => block.enable());
  }
}

Factory.register('radiogroupcontainer', RadioGroupContainer);
