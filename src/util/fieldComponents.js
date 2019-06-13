import React from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

function handlePreventDefault(event) {
  const { relatedTarget } = event;

  if (relatedTarget && relatedTarget.getAttribute('id') && relatedTarget.getAttribute('id').includes('cancel')) {
    event.preventDefault();
  }
}

const fieldComponents = {
  name: ({ fieldProps, name }) => {
    return (
      <Field
        {...fieldProps}
        component={TextField}
        fullWidth
        autoFocus
        placeholder={name}
        onBlur={handlePreventDefault}
      />
    );
  },
  code: ({ fieldProps, name }) => {
    return (
      <Field
        {...fieldProps}
        component={TextField}
        fullWidth
        placeholder={name}
      />
    );
  },
};

export default fieldComponents;
