import Bloodhound from 'typeahead.js';
import compact from 'lodash/compact';
import merge from 'lodash/merge';
import toArray from 'lodash/fp/toArray';
import pickBy from 'lodash/fp/pickBy';
import join from 'lodash/fp/join';
import flow from 'lodash/fp/flow';

import Fieldset from '../fieldset/fieldset';
import Factory from '../factory';
import './address.css';

export default class Address extends Fieldset {
  constructor(config) {
    const items = config.items || [];
    const finalConfig = Object.assign(
      {
        layout: [1, 3]
      },
      config,
      {
        regions: '',
        items: [
          merge({
            block: 'input',
            placeholder: 'введите адрес в свободной форме',
            name: 'адрес-одной-строкой'
          }, items.find(item => item.name === 'адрес-одной-строкой') || {}),
          merge({
            block: 'input',
            placeholder: 'дом',
            name: 'дом'
          }, items.find(item => item.name === 'дом') || {}),
          merge({
            block: 'input',
            placeholder: 'корпус',
            name: 'корпус'
          }, items.find(item => item.name === 'корпус') || {}),
          merge({
            block: 'input',
            placeholder: 'квартира',
            name: 'квартира'
          }, items.find(item => item.name === 'квартира') || {})
        ]
      }
    );

    super(finalConfig);
  }

  afterRender() {
    const addressAutocomplete = this.getItemByName('адрес-одной-строкой') || {};

    if (!addressAutocomplete.el) {
      return;
    }

    this.addressAutocompleteInput = addressAutocomplete.el.find('input');

    if (this.addressAutocompleteInput.length === 0) {
      return;
    }

    const address = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: this.config.url,
        prepare: (query, settings) => this.prepareSettings(query, settings),
        transform: resp => resp.suggestions
      }
    });
    address.initialize();

    this.addressAutocompleteInput
      .typeahead({
        minLength: this.config.autocompleteMinLength || 2,
        highlight: this.config.highlight || true
      }, {
        name: 'address',
        displayKey: 'value',
        source: address.ttAdapter()
      })
      .on('typeahead:selected', (obj, selected) => this.onAddressSelected(selected));

    this.el.find('.tt-menu').css('z-index', 200);
    super.afterRender();
  }

  get value() {
    return Object.assign(super.value[this.name] || super.value, { 'адрес-одной-строкой': this.addressAutocompleteInput.typeahead('val') });
  }

  prepareSettings(query, _settings) {
    const settings = merge({
      type: 'POST',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        query: query || '',
        count: 20,
        locations: []
      }
    }, _settings, this.config.settings);

    settings.url = `${settings.url}?regions=${settings.data.locations.join(',')}&q=${query}`;
    settings.data.locations = settings.data.locations.map(region => ({ region }));
    settings.data = JSON.stringify(settings.data);

    return settings;
  }

  onAddressSelected(_selected = {}) {
    const selected = _selected;
    selected.data = selected.data || {};

    this.setAddressPartValue('дом', selected.data.house);
    this.setAddressPartValue('корпус', selected.data.block);
    this.setAddressPartValue('квартира', selected.data.flat);

    const autocompleteValue = compact([
      this.formatCity(selected.data),
      selected.data.street_with_type || ''
    ]).join(', ');

    this.addressAutocompleteInput.typeahead('val', autocompleteValue);
    this.addressAutocompleteInput.val(autocompleteValue);
  }

  formatCity(addressData) {
    return flow(
      pickBy((data, key) => data && (['area_with_type', 'city_with_type', 'settlement_with_type'].includes(key) ||
        (key === 'region_with_type' && data !== addressData.city_with_type))),
      toArray,
      join(', ')
    )(addressData);
  }

  setAddressPartValue(fieldName, value) {
    const field = this.getItemByName(fieldName);

    if (!field) {
      return;
    }
    field.value = value;
  }
}

Factory.register('address', Address);

