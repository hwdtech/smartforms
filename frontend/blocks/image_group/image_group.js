import $ from 'jquery';
import Base from '../base/base';
import template from './image_group.jade';
import Factory from '../factory';
import './image_group.css';

export default class ImageGroup extends Base {
  get templateFn() {
    return template;
  }

  afterRender() {
    this.el.find('.image-link').click(e => this._onChangeImage(e));
  }

  _onChangeImage(e) {
    this.el.find('.image').removeClass('selected');
    $(e.currentTarget).parent().addClass('selected');
  }

  get value() {
    return {
      [this.config.name]: this.el.find('.image.selected .image-link').data('sourceType')
    };
  }

  set value(val) {
    this.el.find('.image').removeClass('selected');
    this.el.find(`[data-source-type="${val}"]`).parent().addClass('selected');
  }
}

Factory.register('imageGroup', ImageGroup);
