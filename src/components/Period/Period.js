import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { get, isEmpty, isNumber } from 'lodash';

import {
  Col,
  Row,
  Select,
  TextField,
  Label
} from '@folio/stripes/components';

import {
  shortTermExpiryPeriod,
  shortTermClosedDateManagementMenu,
  longTermClosedDateManagementMenu
} from '../../settings/ServicePoints/constants';
import css from './Period.css';


const validateDuration = value => {
  if (typeof value !== 'number') {
    return <FormattedMessage id="ui-tenant-settings.settings.servicePoints.validation.required" />;
  }

  if (value <= 0) {
    return <FormattedMessage id="ui-tenant-settings.settings.validate.greaterThanZero" />;
  }

  return undefined;
};

const Period = ({
  fieldLabel,
  selectPlaceholder,
  dependentValuePath,
  inputValuePath,
  selectValuePath,
  entity,
  intervalPeriods,
  changeFormValue
}) => {
  const inputRef = useRef(null);

  const onInputBlur = () => {
    const inputValue = get(entity, inputValuePath);

    if (isNumber(inputValue)) {
      return;
    }

    changeFormValue(selectValuePath, '');
  };

  const onInputClear = () => {
    changeFormValue(inputValuePath, '');
  };

  const onSelectChange = (e) => {
    changeFormValue(selectValuePath, e.target.value);
    const holdShelfClosedLibraryDateManagementValue =
      shortTermExpiryPeriod.findIndex(item => item === e.target.value) > -1
        ? shortTermClosedDateManagementMenu[0].value
        : longTermClosedDateManagementMenu[0].value;
    changeFormValue(dependentValuePath, holdShelfClosedLibraryDateManagementValue);

    inputRef.current.focus();
  };

  const transformInputValue = (value) => {
    if (isEmpty(value)) {
      return '';
    }

    return Number(value);
  };

  const generateOptions = () => {
    return intervalPeriods.map(({ value, label }) => (
      <option value={value} key={`${selectValuePath}-${value}`}>
        {label}
      </option>
    ));
  };

  return (
    <>
      <Row className={css.labelRow}>
        <Col xs={12}>
          <Label className={css.label} required>
            <FormattedMessage id={fieldLabel} />
          </Label>
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <Field
            data-test-period-duration
            type="number"
            name={inputValuePath}
            component={TextField}
            forwardRef
            inputRef={inputRef}
            onBlur={onInputBlur}
            onClearField={onInputClear}
            parse={transformInputValue}
            validate={validateDuration}
          />
        </Col>
        <Col xs={2}>
          <FormattedMessage id={selectPlaceholder}>
            {placeholder => (
              <Field
                data-test-period-interval
                name={selectValuePath}
                component={Select}
                placeholder={placeholder}
                onChange={onSelectChange}
              >
                {generateOptions()}
              </Field>
            )}
          </FormattedMessage>
        </Col>
      </Row>
    </>
  );
};

Period.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  selectPlaceholder: PropTypes.string.isRequired,
  dependentValuePath: PropTypes.string.isRequired,
  inputValuePath: PropTypes.string.isRequired,
  selectValuePath: PropTypes.string.isRequired,
  entity: PropTypes.object.isRequired,
  intervalPeriods: PropTypes.arrayOf(PropTypes.object),
  changeFormValue: PropTypes.func.isRequired,
};

export default Period;
