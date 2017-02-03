import Checkbox from '../checkbox/checkbox';
import template from './check_group_list_item.jade';
import Factory from '../factory';
import './check_group_list_item.css';

export default class CheckGroupListItem extends Checkbox {
  get templateFn() {
    return template;
  }

  get value() {
    return {
      [this.config.name]: this.el.find('.item-price').html(),
      checked: this._checkboxWrapper.prop('checked')
    };
  }

  afterRender() {
    super.afterRender();

    this.el.find('.link-edit').click(e => this._onLinkEditClick(e));
    this.el.find('.link-delete').click(e => this._onRemoveClick(e));
  }

  _onLinkEditClick(e) {
    e.preventDefault();

    this.trigger('getNewForm', [this.config.footer.formUrl]);
  }

  _onRemoveClick(e) {
    e.preventDefault();

    this.trigger('remove');
  }
}

Factory.register('checkGroupListItem', CheckGroupListItem);
