import Factory from '../factory';

import Fieldset from '../fieldset/fieldset';

import template from './table.jade';

import './table.css';

export default class Table extends Fieldset {
  constructor(config) {
    const finalConfig = Object.assign({}, config);

    finalConfig.layout = Array(Math.floor(finalConfig.items.length / finalConfig.layout.columns)).fill({
      count: finalConfig.layout.columns,
      width: finalConfig.layout.width
    });

    super(finalConfig);
  }

  get templateFn() {
    return template;
  }
}

Factory.register('table', Table);
