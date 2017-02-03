import Factory from '../factory';
import Base from '../base/base';
import template from './divider.jade';

export default class Divider extends Base {
  get templateFn() {
    return template;
  }
}

Factory.register('divider', Divider);
