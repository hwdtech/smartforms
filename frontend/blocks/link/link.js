import linkTemplate from './link.jade';
import newFormLinkTemplate from './new_form_link.jade';

import Base from '../base/base';
import Factory from '../factory';
import './link.css';

export default class Link extends Base {
  get templateFn() {
    return this.config.newFormLink === undefined ? linkTemplate : newFormLinkTemplate;
  }

  afterRender() {
    super.afterRender();

    if (!this.config.newFormLink) {
      return;
    }

    this.el.on('click', e => {
      e.preventDefault();
      this.trigger('getNewForm', [this.config.newFormLink.formUrl]);
    });
  }
}

Factory.register('link', Link);
