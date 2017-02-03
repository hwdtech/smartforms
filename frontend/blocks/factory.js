class Factory {
  constructor() {
    this._blocks = {};
  }

  register(alias, block) {
    if (Object.prototype.hasOwnProperty.call(this._blocks, alias)) {
      throw new Error(`Block ${alias} is already registered.`);
    } else {
      this._blocks[alias] = block;
    }
  }

  get(alias) {
    if (Object.prototype.hasOwnProperty.call(this._blocks, alias)) {
      return this._blocks[alias];
    }
    throw new Error(`Block ${alias} is not registered.`);
  }
}

export default new Factory();
