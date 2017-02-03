import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';

import Container from '../container/container';
import Factory from '../factory';

import './array_field.css';
import template from './array_field.jade';

export default class ArrayField extends Container {
  constructor(config) {
    const fieldsetId = uniqueId();
    const addBtnId = uniqueId();
    const selectId = uniqueId();
    const editorId = uniqueId();

    const items = Array.isArray(config.items) ? config.items : [];
    const fieldsetItems = items.reduce((acc, item) => [...acc, ...[
      {
        block: 'button',
        glyphicon: 'trash',
        cls: 'btn-link remove-array-item'
      },
      {
        block: 'label',
        labelText: item.label,
        rightMark: config.labelRightMark
      }, {
        block: 'text',
        value: item.value || '',
        name: item.name,
        textAlign: config.newItemInputTextAlign
      }
    ]], []);

    const finalConfig = Object.assign({}, config, {
      items: [{
        ...(config.columnHeaders && { columnHeaders: ['', ...config.columnHeaders] }),
        block: 'table',
        id: fieldsetId,
        label: config.itemLabel,
        labelWidth: config.itemLabel ? 3 : 0,
        layout: { columns: 3, width: [1, 8, 3] },
        items: fieldsetItems
      }, config.comment, {
        block: 'actions',
        id: editorId,
        items: [
          Object.assign(config.actions.label, {
            cls: config.actions.label.cls || 'col-sm-3'
          }),
          Object.assign(config.actions.select, {
            cls: config.actions.select.cls || 'col-sm-7',
            id: selectId
          }),
          Object.assign(config.actions.addButton, {
            cls: config.actions.addButton.cls || 'col-sm-2 btn-default',
            id: addBtnId
          })
        ]
      }]
    });

    finalConfig.items = compact(finalConfig.items);

    super(finalConfig);

    this.maxLength = config.maxLength;
    this.currentLength = items.length;
    this.editor = this.getItemById(editorId);
    this.addBtn = this.editor.getItemById(addBtnId);
    this.fieldset = this.getItemById(fieldsetId);
    this.select = this.editor.getItemById(selectId);
  }

  afterRender() {
    this.addBtn.el.on('click', () => {
      this.addNewRow({
        labelText: this.select.nameOfValue,
        value: this.config.defaultValueForNewItem || '',
        name: this.select.value[this.select.name]
      });
    });

    this.select.el.on('change', e => {
      if (e.target.value !== '') {
        this.select.popover('destroy');
      }
    });
    this.el.on('click', '.popover-close', e => {
      e.preventDefault();
      this.select.popover('destroy');
    });

    this.fieldset.items.forEach(row => {
      row.items[0].el.on('click', () => {
        this.removeRowById(row.id);
      });

      row.items[2].on('change', () => {
        this.trigger('change');
      });
    });

    if (this.currentLength === this.maxLength) {
      this.disableControls();
    }

    super.afterRender();
  }

  get templateFn() {
    return template;
  }

  get value() {
    return {
      [this.config.name]: this.fieldset.items.reduce((acc, row) => Object.assign(acc, row.items[2].value), {})
    };
  }

  set value(val) {
    cloneDeep(this.fieldset.items).forEach(row => this.removeRowById(row.id));
    val.forEach(row => this.addNewRow(row));
  }

  disableControls() {
    this.select.disable();
    this.addBtn.disable();
  }

  enableControls() {
    this.select.enable();
    this.addBtn.enable();
  }

  appendChild(block) {
    this.el.find('.form-array').append(block.el);
  }

  addNewRow(row) {
    if (!row || row.name === '') {
      if (this.config.errorMessage) {
        this.select.popover({
          content: `<span>${this.config.errorMessage}</span>`,
          html: true,
          placement: 'top'
        });
        this.select.popover('show');
      }

      return;
    }

    const newRow = this.fieldset.addRow({
      width: [1, 8, 3],
      items: [{
        block: 'button',
        glyphicon: 'trash',
        cls: 'btn-link remove-array-item'
      }, {
        block: 'label',
        labelText: row.labelText,
        rightMark: this.config.labelRightMark
      }, {
        block: 'text',
        value: row.value,
        name: row.name,
        textAlign: this.config.newItemInputTextAlign
      }]
    });

    this.currentLength += 1;

    if (this.currentLength === this.maxLength) {
      this.disableControls();

      if (this.config.helpMessage) {
        this.select.popover({
          content: `<span class="help-message">${this.config.helpMessage}</span>`,
          title: '<div class="clearfix"><a href="#" class="popover-close pull-right">Закрыть ×</a></div>',
          html: true,
          placement: 'top'
        });
        this.select.popover('show');
      }
    }

    newRow.items[0].el.on('click', () => {
      this.removeRowById(newRow.id);
    });

    newRow.items[2].on('change', () => {
      this.trigger('change');
    });

    this.select.removeOptionByValue(row.name);

    newRow.items[2].afterRender();
  }

  removeRowById(id) {
    const row = this.fieldset.getItemById(id);

    this.select.addOption({
      value: row.items[2].name,
      text: row.items[1].dataText
    });
    this.select.sortOptionsByText();
    this.fieldset.removeRowById(id);
    this.trigger('change');
    this.currentLength -= 1;
    if (this.currentLength <= this.maxLength) {
      this.enableControls();
      this.select.popover('destroy');
    }
  }

  get sum() {
    return this.fieldset.items.reduce((acc, row) => acc + (parseFloat(row.items[2].value[row.items[2].name]) || 0), 0);
  }
}

Factory.register('array', ArrayField);
