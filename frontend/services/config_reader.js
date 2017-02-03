import isString from 'lodash/isString';
import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';

const fieldsetBlocks = [
  'address'
];

function pushContainer(acc, item, config, globalConfigItemsArray) {
  // eslint-disable-next-line no-use-before-define, no-param-reassign
  item.items = item.items && configureFormItemsBySchema(item.items, config, globalConfigItemsArray);
  acc.push(item);

  return acc;
}

function pushExtendedBlock(acc, formItem, containerItem) {
  acc.push(!fieldsetBlocks.includes(formItem.block)
    ? Object.assign({ name: containerItem }, formItem)
    : formItem);

  return acc;
}

/**
 * configureFormItemsBySchema - function which check all items in schema and add items from form section to final config
 * @param  {object} items - schema section of json
 * @param  {object} config - schema section of json or container items array
 * @return {array} items for form creation
 */
function configureFormItemsBySchema(items, config, globalConfigItemsArray) {
  return items.reduce((acc, containerItem) => {
    const formItem = config.form[containerItem];
    const globalFormItem = globalConfigItemsArray[containerItem];
    if (!formItem && !globalFormItem && isString(containerItem)) {
      return acc;
    }

    if (!formItem && isString(containerItem)) {
      return globalFormItem.items
        ? pushContainer(acc, globalFormItem, config, globalConfigItemsArray)
        : pushExtendedBlock(acc, globalFormItem, containerItem);
    } else if (isString(containerItem)) {
      return pushExtendedBlock(acc, formItem, containerItem);
    }

    return pushContainer(acc, containerItem, config, globalConfigItemsArray);
  }, []);
}

/**
 * configureFormItemsWithoutSchema - function which add all items from form section to final config
 * @param  {object} form - form section of json
 * @return {array} items for form creation
 */
function configureFormItemsWithoutSchema(form) {
  return map(form, (item, name) => (!fieldsetBlocks.includes(item.block)
      ? Object.assign({ name }, item)
      : item
  ));
}

/**
 * getItems - function which configures items array for final config
 * @param  {object} config - form configuration object
 * @param  {object} form - form section of config with items as array
 * @return {array} configured items array
 */
function getItems(config, form, globalConfigItemsArray) {
  if (Array.isArray(config.schema)) {
    return configureFormItemsBySchema(config.schema, config, globalConfigItemsArray);
  }

  return configureFormItemsWithoutSchema(form);
}

/**
 * formatFormFieldsItemsToArray - function check all cases in form config section and change items to array if it's
 * not an array and add key as name of array item
 * @param  {object} form - form section of json
 * @return {object} finalForm - new form config which include items as array
 */
function formatFormFieldsItemsToArray(form = {}) {
  const finalForm = cloneDeep(form);

  Object.keys(finalForm)
    .filter(key => finalForm[key].items && !Array.isArray(finalForm[key].items))
    .forEach(key => {
      finalForm[key].items = map(finalForm[key].items, (item, name) => Object.assign({ name }, item));
    });

  return finalForm;
}

export default {
  createFormConfig(config, globalConfig = {}) {
    const finalConfig = cloneDeep(config);

    const globalConfigItemsArray = formatFormFieldsItemsToArray(globalConfig);
    finalConfig.form = formatFormFieldsItemsToArray(finalConfig.form);
    finalConfig.items = getItems(finalConfig, finalConfig.form, globalConfigItemsArray);

    return finalConfig;
  },

  createModalConfig(config, globalConfig = {}) {
    const finalConfig = cloneDeep(config);

    // allow users to create modal configuration without footer
    finalConfig.footer = Object.assign({ form: {}, schema: [] }, finalConfig.footer);

    const bodyJsonWithFormatedForm = finalConfig.body;
    const footerJsonWithFormattedForm = finalConfig.footer;
    const globalConfigItemsArray = formatFormFieldsItemsToArray(globalConfig);

    bodyJsonWithFormatedForm.form = formatFormFieldsItemsToArray(finalConfig.body.form);
    finalConfig.body = getItems(finalConfig.body, bodyJsonWithFormatedForm.form, globalConfigItemsArray);

    footerJsonWithFormattedForm.form = formatFormFieldsItemsToArray(finalConfig.footer.form);
    finalConfig.footer = getItems(finalConfig.footer, footerJsonWithFormattedForm.form, globalConfigItemsArray);

    return finalConfig;
  }
};
