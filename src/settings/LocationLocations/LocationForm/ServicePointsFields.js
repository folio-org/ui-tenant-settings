import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
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

class ServicePointsFields extends React.Component {
  static propTypes = {
    servicePoints: PropTypes.arrayOf(PropTypes.object),
    changePrimary: PropTypes.func.isRequired,
    formValues: PropTypes.object.isRequired,
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.singlePrimary = this.singlePrimary.bind(this);
    this.renderFields = this.renderFields.bind(this);
    this.radioButtonComp = this.radioButtonComp.bind(this);
    this.list = {};
  }

  singlePrimary(id) {
    const { changePrimary, formValues } = this.props;

    formValues.servicePointIds.forEach((a, i) => {
      if (i === id) {
        changePrimary(i, true);
      } else {
        changePrimary(i, false);
      }
    });
  }

  radioButtonComp({ input, ...props }) {
    return (
      <RadioButton
        onChange={() => {
          this.singlePrimary(props.fieldIndex);
        }}
        checked={input.value}
        name={input.name}
        aria-label={`servicePoint use as primary ${props.fieldIndex}`}
      />
    );
  }

  renderFields(field, index) {
    const { formValues } = this.props;

    const list = omitUsedOptions(this.props.servicePoints, formValues.servicePointIds, 'selectSP', index);
    const sortedList = sortBy(list, ['label']);
    const options = [{
      label: this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.servicePoints.placeholder' }),
      value: ''
    }, ...sortedList];

    return (
      <Layout className={`flex ${css.fieldsLayout}`} key={index}>
        <Layout className={`display-flex ${css.selectLayout}`}>
          <FormattedMessage id="ui-tenant-settings.settings.location.locations.servicePoints">
            {labelChunks => (
              <div className={css.selectField}>
                <Field
                  component={Select}
                  name={`${field}.selectSP`}
                  id="servicePointSelect"
                  dataOptions={options}
                  marginBottom0
                  aria-label={labelChunks.join()}
                />
              </div>
            )}
          </FormattedMessage>
        </Layout>
        <Layout className={`display-flex ${css.radioButtonLayout}`}>
          <Field
            component={this.radioButtonComp}
            fieldIndex={index}
            name={`${field}.primary`}
          />
        </Layout>
      </Layout>
    );
  }


  render() {
    const { formValues, servicePoints } = this.props;

    const availableServicePoints = omitUsedOptions(servicePoints, formValues.servicePointIds, 'selectSP');
    const sortedList = sortBy(availableServicePoints, ['label']);

    const canAddMoreServicePoints = sortedList.length > 0;

    const isPrimary = formValues.servicePointIds && formValues.servicePointIds.length === 1 && !formValues.servicePointIds[0].primary;

    if (isPrimary) {
      this.singlePrimary(0);
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
          addLabel={canAddMoreServicePoints ? <Icon icon="plus-sign">Add service point</Icon> : ''}
          legend={legend}
          emptyMessage={<span className={css.emptyMessage}>Location must have at least one service point</span>}
          component={RepeatableField}
          name="servicePointIds"
          renderField={this.renderFields}
        />
      </>
    );
  }
}

export default injectIntl(ServicePointsFields);
