import Container from '../container/container';
import template from './check_group_list.jade';
import Factory from '../factory';
import './check_group_list.css';

export default class CheckGroupList extends Container {
  get templateFn() {
    return template;
  }

  appendChild(block) {
    this.el.append(block.el);
  }

  afterRender() {
    super.afterRender();

    this.items.forEach(block => {
      block.on('remove', () => {
        block.el.remove();
        const removedItemIndex = this.items.indexOf(block);
        if (removedItemIndex !== -1) {
          this.items.splice(removedItemIndex, 1);
        }
        this.trigger('change');
      });
      block.on('change', () => this.trigger('change'));
    });
  }

  get value() {
    return {
      [this.config.name]: this.items.map(block => block.value)
    };
  }

  get sum() {
    return this.items.reduce((acc, block) => {
      const value = block.value || {};

      if (!value.checked) {
        return acc;
      }

      return acc + (parseFloat(value[block.name]) || 0);
    }, 0);
  }
}

Factory.register('checkGroupList', CheckGroupList);
