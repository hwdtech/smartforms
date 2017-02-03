import template from './checkbox_with_collapsed_container.jade';

import Container from '../../container/container';
import Factory from '../../factory';
import Checkbox from '../checkbox';

export default class CheckboxWithCollapsedContainer extends Container {
  constructor(config) {
    super(config);
    this._checkbox = new Checkbox(config.checkbox);
  }

  get templateFn() {
    return template;
  }

  appendChild(block) {
    this.el.find('.collapsed-container').append(block.el);
  }

  render() {
    super.render();

    this._checkbox.render();

    this.el.find('.checkbox-container').append(this._checkbox.el);
  }

  toogleContainer(mode) {
    this.el.find('.collapsed-container')[mode](400);
  }

  afterRender() {
    super.afterRender();
    this._checkbox.afterRender();
    this.toogleContainer(this.config.checkbox.checked
      ? 'slideDown'
      : 'slideUp'
    );
    this._checkbox.on('change', (e, target, value) => (value[this.config.checkbox.name]
        ? this.toogleContainer('slideDown')
        : this.toogleContainer('slideUp')
    ));
  }

  get value() {
    const result = this._checkbox.value[this._checkbox.name]
      ? Object.assign({}, this._checkbox.value, super.value[this.config.name])
      : this._checkbox.value;

    return this.config.name ? { [this.config.name]: result } : result;
  }

  set value(val) {
    this._checkbox.value = val[this.config.checkbox.name];

    this.toogleContainer(val[this.config.checkbox.name]
      ? 'slideDown'
      : 'slideUp'
    );

    super.value = val;
  }
}

Factory.register('checkboxWithCollapsedContainer', CheckboxWithCollapsedContainer);
