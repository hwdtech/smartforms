var combiner = {
  getForm(schemaJson, formJson, globalConfig) {
    const schema = JSON.parse(JSON.stringify(schemaJson));
    const form = JSON.parse(JSON.stringify(formJson));// Optimize
    const allowedIndividualElements = [
      'штрихкод',
      'лицевой-счет'
    ];

    return splitItems();

    function splitItems() {
      if ((schema.length === 1) && isAllowedIndividualElements(schema[0].name)) { // Optimize
        leaveOnlyOneElement(schema[0].name);
        return form;
      }

      schema.filter(isTable).forEach(item => {
        calculateTableElement(item);
      });

      schema.filter(e => !isTable(e)).forEach(item => {
        calculateSimpleElement(item);
      });

      console.log('Полученая схема');
      console.log(schema);
      console.log('Сгенерированная форма');
      console.log(form);
      return form;
    }

    function isAllowedIndividualElements(allovedElementName) {
      return allowedIndividualElements.indexOf(allovedElementName) > -1;
    }

    function leaveOnlyOneElement(fieldName) {
      form.body.schema = [fieldName];
      form.body.form[fieldName] = globalConfig[fieldName];
    }

    function isTable(obj) {
      return 'columns' in obj;
    }

    function calculateTableElement(element) {
      const itemDescription = tableIsInForm(element);
      if (itemDescription.type === 'table') { createTable(element); }
      if (itemDescription.type === 'fieldset') { createFieldset(element); }
      if (itemDescription.type === 'text') { createCustomTextTable(element); }
      if (itemDescription.type === 'array') { createCustomArrayTable(element); }
      if (itemDescription.type === 'emptyTable') { deleteItemFromSchema(element); }
      if (itemDescription.type === 'selectWithValue') { createCustomSelectWithValueTable(element); }
    }

    function calculateSimpleElement(element) {
      const elementName = element.name;
      let formElement = null;
      if (elementIsInForm(elementName)) {
        formElement = form.body.form[elementName];
        formElement.value = element.value;
        formElement.validationRules = [];
        if (element.visible === false)
          { formElement.hidden = true; } else if (element.constraints) {
            element.constraints.forEach(item => {
              formElement.validationRules.push({ rule: item.constraint, errorMessage: item.error });
            });
          }
      }
    }

    function tableIsInForm(element) {
      const description = {
        thereIsInForm: false,
        type: 'emptyTable'
      };
      if (element.values && element.values.length < 1) // Optimize
        { return description; }
      const elementName = element.name;
      form.body.schema.forEach(item => {
        if (item === elementName || item.name === elementName) {
          description.thereIsInForm = true;
          description.type = item.block || form.body.form[elementName].block;
        }
      });
      return description;
    }

    function elementIsInForm(name) {
      return (name in form.body.form) || elementIsInConfig(name);
    }

    function elementIsInConfig(name) {
      if (name in globalConfig) {
        form.body.form[name] = globalConfig[name];
        return true;
      }
      return false;
    }

    function createTable(element) {
      const columns = calculateColumns(element);
      createColumnHeaders(element.name, columns);
      calculateTableColumns(element, columns);
    }

    function createFieldset(element) {
      const columns = calculateColumns(element);
      createRowsForFieldset(element.name, element.columns.length);
      calculateTableColumns(element, columns);
    }

    function createCustomTextTable(schemaElement) {
      const element = form.body.form[schemaElement.name];
      element.value = schemaElement.values[0]['к-оплате'];
    }

    function createCustomArrayTable(element) {
      const elementName = element.name;
      const headers = element.columns;
      const arrayFormElement = form.body.form[elementName];
      arrayFormElement.items = [];
      element.values.forEach((item, index) => {
        calculateArrayItems(item, arrayFormElement, elementName, index, headers);
      });
    }

    function calculateArrayItems(item, formElement, elementName, index, headers) {
      const itemName = `${elementName}_${headers[1].name}_${index}`;
      const nameService = item[headers[0].name];
      let itemTemplate = null;

      if (index < 3) {
        itemTemplate = {
          label: nameService,
          value: item[headers[1].name] || '0.00',
          name: itemName
        };
        formElement.items.push(itemTemplate);
      } else {
        itemTemplate = {
          value: itemName,
          name: nameService
        };
        formElement.actions.select.values.push(itemTemplate);
      }
    }

    function deleteItemFromSchema(element) {
      form.body.schema = form.body.schema.filter(item => item.name !== element.name);
    }

    function calculateColumns(element) {
      const columns = [];
      element.columns.filter(columnIsVisible).forEach(column => {
        columns.push(column.name);
      });
      return columns;
    }

    function columnIsVisible(obj) {
      if (obj.visible === false) { return false; }
      return true;
    }

    function calculateTableColumns(element, columns) {
      element.values.forEach((item, i) => {
        columns.forEach(key => {
          createTableColumnElement(key, item[key], element.name, i);
        });
      });
    }

    function createTableColumnElement(key, value, tableName, elementNumber) {
      const elementName = `${tableName}_${key}_${elementNumber}`;

      const summElement = form.body.form['всего-к-оплате'];
      if (key === 'к-оплате' && summElement) { summElement.summarize.push(elementName); }

      const formElement = Object.assign({}, form.body.form[key]);
      (formElement.block === 'label') ?
        formElement.labelText = value :
        formElement.value = value;

      form.body.form[elementName] = formElement;

      insertElementNameInToTableItems(elementName, tableName);
    }

    function insertElementNameInToTableItems(elementName, tableName) {
      const index = form.body.schema.findIndex(x => x.name === tableName);
      form.body.schema[index].items.push(elementName);
    }

    function createColumnHeaders(tableName, headers) {
      const index = form.body.schema.findIndex(x => x.name === tableName);
      const columnHeaders = form.body.schema[index].columnHeaders;

      headers.forEach(key => {
        if (columnHeaders) { columnHeaders.push(normalizeHeader(key)); }
      });
    }

    function normalizeHeader(header) {
      let result = header.replace(/-/g, ' ');
      result = result.charAt(0).toUpperCase() + result.substr(1).toLowerCase();
      return result;
    }

    function createRowsForFieldset(fieldsetName, count) {
      const element = form.body.schema.find(x => x.name === fieldsetName);
      const layout = element.layout[0];
      for (; count > 0; count--) {
        element.layout.push(layout);
      }
    }

    function createCustomSelectWithValueTable(element) {
      var elementName = element.name;
      var selectElement = form.body.form[elementName];
      var value;
      var name;
      element.values.forEach(function(item) {
        name = item.name;
        value = item.value;
        selectElement.values.push({name: name, value: value});
      });
      var activeElement = element.values.filter(function(item) {
        return item.isActive === true;
      });
      selectElement.value = activeElement[0].значение;
    }
  },

  getSchema(schemaJson, formData) {
    const schema = JSON.parse(JSON.stringify(schemaJson));
    const form = formData;

    const markTags = [
      'метка',
      'добавить-метку'
    ];
    const reminderTags = [
      'добавить-напоминание',
      'тип-напоминания',
      'напоминание'
    ];

    return mergeSchemaAndFormData();

    function mergeSchemaAndFormData() {
      schema.filter(isTable).forEach(object => {
        mergeTableElement(object);
      });

      schema.filter(e => !isTable(e)).forEach(object => {
        mergeSimpleElement(object);
      });

      console.log('Заполеннная форма');
      console.log(formData);
      console.log('Заполеннная схема');
      console.log(schema);
      return schema;
    }

    function isTable(obj) {
      return 'columns' in obj;
    }

    function mergeSimpleElement(element) {
      const elementName = element.name;
      if (markTags.includes(elementName)) { calculateMark(element); } else if (reminderTags.includes(elementName)) { calculateReminder(element); } else {
        const value = form[elementName];
        if (value) { element.value = value; }
      }
    }

    function calculateMark(element) {
      const elementName = element.name;
      let value = null;

      switch (elementName) {
        case 'метка':
          value = form['метка']['метка'];
          break;
        case 'добавить-метку':
          value = form['метка']['добавить-метку'];
          break;
      }

      if (value != null) { element.value = value; }
    }

    function calculateReminder(element) {
      const elementName = element.name;
      let value = null;
      const addReminder = form['Напоминание']['добавить-напоминание'];

      if (elementName === 'добавить-напоминание') { value = addReminder; }

      if (elementName === 'напоминание' && addReminder) {
        const date = form['Напоминание']['напоминание']['дата'];
        value = date || form['Напоминание']['напоминание']['число'];
      }
      if (elementName === 'тип-напоминания' && addReminder) { value = form['Напоминание']['напоминание']['напоминание']; }

      if (value != null) { element.value = value; }
    }

    function mergeTableElement(element) {
      const items = form[element.name];

      if (items === undefined) { return false; }

      if (typeof items === 'string') { // Optimize
        mergeCustomTextTable(element);
        return false;
      }


      if (element.name in items) { // Optimize
        mergeCustomRadioGroup(element);
        return false;
      }

      mergeTable(element);
    }

    function mergeTable(element) {
      const items = form[element.name];
      let splittedClumn = null;
      for (const key in items) {
        splittedClumn = key.split('_');
        element.values[splittedClumn[2]][splittedClumn[1]] = items[key];
      }
    }

    function mergeCustomTextTable(element) {
      element.values[0]['к-оплате'] = form[element.name];
    }

    function mergeCustomRadioGroup(element) {
      const elementName = element.name;
      element.values = [];
      element.values.push({
        'наименование-услуги': form[elementName][elementName],
        'к-оплате': form[elementName]['к-оплате']
      });
    }
  },

  getCart(schemaJson, globalConfig) {
    const schemas = schemaJson;
    const cartForm = {
      block: 'modal',
      submitButton: {
        label: 'Перейти к оплате'
      },
      iagree: {
        htmlLabel: 'Я соглашаюсь с <a href="/legal-information/docs/" target="_blank">условиями<\/a> договора-оферты',
        checked: true
      },
      isPanelGroup: true,
      body: {
        form: {},
        schema: []
      }
    };
    const form = JSON.parse(JSON.stringify(cartForm));// Optimize

    return splitItems();

    function splitItems() {
      schemas.forEach((item, index) => {
        calculateItemOfCart(item, index);
      });

      console.log('Полученая схема');
      console.log(schemas);
      console.log('Сгенерированная форма');
      console.log(form);
      return form;
    }

    function calculateItemOfCart(item, index) {
      const element = JSON.parse(JSON.stringify(globalConfig['платеж-корзины']));// Optimize
      element.title = item.form.title;
      element.subtitle = item.form.subtitle;
      element.cost = item.schema.find(x => x.name === 'всего-к-оплате').value;
      element.imgUrl = item.form.imgUrl;
      addFieldsFromGlobalConfig(item.form, globalConfig);
      const calculatedForm = combiner.getForm(item.schema, item.form, globalConfig).body;
      element.form = JSON.parse(JSON.stringify(calculatedForm)); // Optimize
      const elementName = item.schema.find(x => x.name === 'guid').value;
      pushItemNameInToCartSchema(elementName);
      form.body.form[elementName] = element;
    }

    function addFieldsFromGlobalConfig(formOfInvoice, config) {
      const resultForm = formOfInvoice.body;
      resultForm.schema.forEach((item, index) => {  // Optimize
        if ((typeof item === 'string') && !(item in resultForm.form) && (item in config)) {
          if (config[item].block === 'fieldset') { resultForm.schema[index] = JSON.parse(JSON.stringify(config[item])); }// Optimize
          else { resultForm.form[item] = JSON.parse(JSON.stringify(config[item])); }
        }
      });
    }

    function pushItemNameInToCartSchema(elementName) {
      form.body.schema.push(elementName);
    }
  },

  getReceiptForm(reports, linkToReports) {
    const reportsForm = {
      items: [
        {
          name: 'receiptModalBody',
          block: 'receiptModalBody',
          reports
        },
        {
          name: 'receiptButton',
          block: 'receiptModalFooter',
          text: 'Распечатать все',
          link: linkToReports
        }
      ]
    };
    const form = JSON.parse(JSON.stringify(reportsForm));// Optimize

    return splitItems();

    function splitItems() {
      return form;
    }
  },

  getPersonalDataForm(schemaJson, formJson) {
    const addressFields = [
      'адрес-одной-строкой',
      'дом',
      'корпус',
      'квартира'
    ];

    return splitItems();

    function splitItems() {
      schemaJson.forEach(item => {
        calculateSimpleElement(item);
      });
      return formJson;
    }

    function calculateSimpleElement(element) {
      const elementName = element.name;
      let formElement = null;

      if (addressFields.includes(elementName)) { formElement = formJson.form.address.items[elementName]; } else { formElement = formJson.form[elementName]; }

      if (formElement) { formElement.value = element.value; }
    }
  },

  getPersonalDataSchema(schemaJson, formData) {
    const schema = schemaJson;
    const form = formData;

    return mergeSchemaAndFormData();

    function mergeSchemaAndFormData() {
      schema.forEach(object => {
        mergeElements(object);
      });

      return schema;
    }

    function mergeElements(element) {
      const elementName = element.name;
      if (elementName in form) { element.value = form[elementName]; }
    }
  }
};
