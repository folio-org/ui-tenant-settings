import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import PropTypes from 'prop-types';
import { sortBy, cloneDeep, findIndex } from 'lodash';

import {
  Icon,
  Layout,
  RadioButton,
  RepeatableField,
  Select,
} from '@folio/stripes/components';

import css from './ServicePointsFields.css';


const omitUsedOptions = (list, usedValues, key, id) => {
  const unUsedValues = cloneDeep(list);
  if (usedValues) {
    usedValues.forEach((item, index) => {
      if (id !== index && item) {
        const usedValueIndex = findIndex(unUsedValues, v => {
          return v.label === item[key];
        });
        if (usedValueIndex !== -1) {
          unUsedValues.splice(usedValueIndex, 1);
        }
      }
    });
  }
  return unUsedValues;
};

const ServicePointsFields = ({ servicePoints, changePrimary, formValues }) => {
  const list = omitUsedOptions(servicePoints, formValues.servicePointIds, 'selectSP');

  const singlePrimary = (id) => {
    formValues.servicePointIds.forEach((a, i) => {
      if (i === id) {
        changePrimary(i, true);
      } else {
        changePrimary(i, false);
      }
    });
  };

  const radioButtonComp = ({ input, fieldIndex }) => {
    return (
      <RadioButton
        onChange={() => { singlePrimary(fieldIndex); }}
        checked={input.value}
        name={input.name}
        aria-label={`servicePoint use as primary ${fieldIndex}`}
      />
    );
  };

  const renderFields = (field, index) => {
    const availableOptions = omitUsedOptions(servicePoints, formValues.servicePointIds, 'selectSP', index);
    const sortedList = sortBy(availableOptions, ['label']);
    const options = [{ label: 'Select service point', value: '' }, ...sortedList];

    return (
      <Layout className={`flex ${css.fieldsLayout}`} key={index}>
        <Layout className={`display-flex ${css.selectLayout}`}>
          <FormattedMessage id="ui-tenant-settings.settings.location.locations.servicePoints">
            {labelChunks => (
              <Field
                component={Select}
                name={`${field}.selectSP`}
                id="servicePointSelect"
                dataOptions={options}
                className={css.selectField}
                marginBottom0
                aria-label={labelChunks.join()}
              />
            )}
          </FormattedMessage>
        </Layout>
        <Layout className={`display-flex ${css.radioButtonLayout}`}>
          <Field
            component={radioButtonComp}
            fieldIndex={index}
            name={`${field}.primary`}
          />
        </Layout>
      </Layout>
    );
  };

  // Make the last existing service point to be the primary one
  if (formValues.servicePointIds && formValues.servicePointIds.length === 1 && !formValues.servicePointIds[0].primary) {
    singlePrimary(0);
  }

  const legend = (
    <Layout className="display-flex">
      <Layout className={`${css.label} ${css.servicePointsLabel}`}>
        <FormattedMessage id="ui-tenant-settings.settings.location.locations.servicePoints" />
        <span className={css.asterisk}>*</span>
      </Layout>
      <Layout className={`${css.label} ${css.primaryLabel}`}>
        <FormattedMessage id="ui-tenant-settings.settings.location.locations.primary" />
      </Layout>
    </Layout>
  );

  return (
    <>
      <FieldArray
        addLabel={
          Object.keys(list).length > 1 ?
            <Icon icon="plus-sign">Add service point</Icon> :
            ''
        }
        legend={legend}
        emptyMessage={<span className={css.emptyMessage}>Location must have at least one service point</span>}
        component={RepeatableField}
        name="servicePointIds"
        renderField={renderFields}
      />
    </>
  );
};

ServicePointsFields.propTypes = {
  servicePoints: PropTypes.arrayOf(PropTypes.object),
  changePrimary: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default ServicePointsFields;
