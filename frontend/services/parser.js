import Parser from 'morph-expressions';
import isNil from 'lodash/isNil';

const parser = new Parser();

parser.registerProperty('обязательное', scope => {
  const value = scope[scope.fieldName];

  return !isNil(value) && value !== '';
});

parser.registerProperty('длина', scope => {
  const value = scope[scope.fieldName] || '';

  return value.length;
});

parser.registerProperty('значение', scope => scope[scope.fieldName] || '');

parser.registerProperty('русский', scope => /^[а-яё.\- ]{1,255}$/i.test(scope[scope.fieldName] || ''));

parser.registerProperty('адрес', scope => (/^[0-9а-яё\s\.,\-;\/\(\)"]{1,255}$/i.test(scope[scope.fieldName] || '')
    ? scope[scope.fieldName]
    : false));

parser.registerProperty('дом', scope => (/^[0-9а-яa-zё\/]{1,7}$/i.test(scope[scope.fieldName] || '')
    ? scope[scope.fieldName]
    : false));

parser.registerProperty('email', scope => (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i.test(scope[scope.fieldName] || '')
    ? scope[scope.fieldName]
    : false));

parser.registerProperty('password', scope => (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-z0-9!@#$%^&*]{6,16}$/i.test(scope[scope.fieldName] || '')
    ? scope[scope.fieldName]
    : false));

parser.registerProperty('изЦифр', scope => /^\d+$/.test(scope[scope.fieldName] || ''));

parser.registerProperty('штрихкод', scope => /^[0-9]{13}$/i.test(scope[scope.fieldName] || ''));

parser.registerProperty('артикул', scope => /^[а-яё0-9.,\/]{7,9}$/i.test(scope[scope.fieldName] || ''));

parser.registerProperty('телефон', scope => /^\+7\s9[0-9]{9}$/i.test(scope[scope.fieldName] || ''));

parser.registerProperty('домашнийТелефон', scope => /^\+7\s[0-9]{10}$/i.test(scope[scope.fieldName] || ''));

parser.registerProperty('число', scope => /^[0-9]+(([.,])[0-9]{1,2})?$/i.test(scope[scope.fieldName] || ''));

export default parser;
