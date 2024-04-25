/* eslint-disable react/prop-types, import/prefer-default-export */
import { Field } from 'react-final-form';

import {
  Checkbox,
  TextField,
  MultiSelection,
} from '@folio/stripes/components';

import { readingRoomAccessColumns } from './constant';

export const getFieldComponents = (fieldLabels, options) => ({
  [readingRoomAccessColumns.NAME]: ({ fieldProps, name, rowIndex, fieldIndex }) => (
    <Field
      {...fieldProps}
      component={TextField}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      placeholder={fieldLabels[name]}
      marginBottom0
      autoFocus={fieldIndex === 0}
    />
  ),
  [readingRoomAccessColumns.ISPUBLIC]: ({ fieldProps, name, rowIndex }) => (
    <Field
      {...fieldProps}
      aria-label={`${fieldLabels[name]} ${rowIndex}`}
      component={Checkbox}
      initialValue={false}
      type="checkbox"
      marginBottom0
    />
  ),
  [readingRoomAccessColumns.SERVICEPOINTS]: ({ fieldProps, name, rowIndex }) => (
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
  )
});
