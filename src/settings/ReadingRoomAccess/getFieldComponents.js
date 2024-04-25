import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import {
  Checkbox,
  TextField,
  MultiSelection,
} from '@folio/stripes/components';

import { readingRoomAccessColumns } from './constant';

/* eslint-disable import/prefer-default-export */
export const getFieldComponents = (fieldLabels, options) => ({
  [readingRoomAccessColumns.NAME]: Object.assign(
    ({ fieldProps, name, rowIndex, fieldIndex }) => (
      <Field
        {...fieldProps}
        component={TextField}
        aria-label={`${fieldLabels[name]} ${rowIndex}`}
        placeholder={fieldLabels[name]}
        marginBottom0
        autoFocus={fieldIndex === 0}
      />
    ),
    { propTypes: { fieldProps: PropTypes.object, name: PropTypes.string, rowIndex: PropTypes.number, fieldIndex: PropTypes.number } }
  ),
  [readingRoomAccessColumns.ISPUBLIC]: Object.assign(
    ({ fieldProps, name, rowIndex }) => (
      <Field
        {...fieldProps}
        aria-label={`${fieldLabels[name]} ${rowIndex}`}
        component={Checkbox}
        initialValue={false}
        type="checkbox"
        marginBottom0
      />
    ),
    { propTypes: { fieldProps: PropTypes.object, name: PropTypes.string, rowIndex: PropTypes.number } }
  ),
  [readingRoomAccessColumns.SERVICEPOINTS]: Object.assign(
    ({ fieldProps, name, rowIndex }) => (
      <Field
        {...fieldProps}
        id="rra-service-point"
        component={MultiSelection}
        aria-label={`${fieldLabels[name]} ${rowIndex}`}
        dataOptions={options}
        renderToOverlay
        marginBottom0
        validationEnabled
        onBlur={e => e.preventDefault()}
      />
    ),
    { propTypes: { fieldProps: PropTypes.object, name: PropTypes.string, rowIndex: PropTypes.number } }
  )
});
