import React from 'react';

import { screen, render } from '@testing-library/react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import '../../../test/jest/__mocks__';

import RepeatableField from '.';

const addButtonIdMock = '1';
const addLabelMock = <span>AddLabel</span>;
const labelMock = <span>RepeatableFieldLabel</span>;
const templateMock = [
  {
    component: 'div',
    name: 'name',
    renderValue: jest.fn(),
  },
  {
    name: 'value',
  }
];

const newItemTemplateMock = {
  name: '',
  value: ''
};

const renderRepeatableField = () => render(
  <Form
    onSubmit={() => {}}
    mutators={{ ...arrayMutators }}
    render={() => (
      <RepeatableField
        addButtonId={addButtonIdMock}
        label={labelMock}
        addLabel={addLabelMock}
        name="RepeatableField"
        addDefaultItem
        newItemTemplate={newItemTemplateMock}
        template={templateMock}
      />
    )}
  />
);

describe('RepeatableField', () => {
  it('should render RepeatableField label', async () => {
    renderRepeatableField();

    expect(screen.getByText('RepeatableFieldLabel')).toBeVisible();
  });
});
