import Base from '../base/base';
import Factory from '../factory';
import './container.css';

export default class Container extends Base {
  constructor(config) {
    super(config);

    this.initItems();
  }

  initItems() {
    this._items = this.config.items.map(blockConfig => {
      const BlockCtor = Factory.get(blockConfig.block);

      const block = new BlockCtor(blockConfig);

      block.parent = this;

      return block;
    });
  }

  render() {
    super.render();

    this.items.forEach(block => {
      block.render();
      this.appendChild(block);
    });
  }

  getItemById(id) {
    return this.items.find(item => item.id === id);
  }

  getItemByName(name) {
    let itemInContainer = false;
    const block = this.items.find(item => {
      if (item.isContainer()) {
        itemInContainer = item.getItemByName(name);
      }

      return item.name === name || itemInContainer;
    });

    return itemInContainer || block;
  }

  getItemByAlias(alias) {
    return this.items.find(item => item.config.alias === alias);
  }

  validate() {
    return this.items.every(block => block.validate());
  }

  removeErrors() {
    this.items.forEach(block => block.removeErrors());
  }

  get isValid() {
    return this.items.every(block => block.isValid);
  }

  get value() {
    const result = {};

    this.items.forEach(block => Object.assign(result, block.value));

    return this.config.name ? { [this.config.name]: result } : result;
  }

  set value(val) {
    Object.keys(val)
      .forEach(fieldName => {
        const field = this.getItemByName(fieldName);

        if (!field) {
          return;
        }

        field.value = val[fieldName];
      });
  }

  appendChild() {
    throw new Error('Not implemented');
  }

  afterRender() {
    this.items.forEach(block => {
      block.afterRender();
      block.on('showGlobalError', (e, errorMessage) => {
        this.trigger('showGlobalError', errorMessage);
      });
      block.on('getNewForm', (e, formUrl) => {
        this.trigger('getNewForm', formUrl);
      });
      block.on('initValueRule', (e, _block, valueRule) => {
        this.onInitValueRule(_block, valueRule);
      });
      block.initBlockValueRule();
    });
  }

  onInitValueRule(block, valueRule) {
    this.trigger('initValueRule', [block, valueRule]);
  }

  initBlockValueRule() {
    this.items.forEach(block => block.initBlockValueRule());
  }

  get items() {
    return this._items;
  }

  isContainer() {
    return true;
  }
}
