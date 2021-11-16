import React from 'react';

import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import '../../../test/jest/__mocks__';


import Period from './Period';

const entityMock = {
  code: 'cd1',
  discoveryDisplayName: 'Circulation Desk -- Hallway',
  holdShelfExpiryPeriod: {
    duration: 3,
    intervalId: 'Weeks',
  },

  id: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
  metadata: { createdDate: '2021-11-10T12:10:20.764+00:00', updatedDate: '2021-11-10T12:10:20.764+00:00' },
  name: 'Circ Desk 1',
  pickupLocation: true,
  staffSlips: [true, true, true, true]
};

const intervalPeriods = [
  {
    id: 1,
    label: 'Minutes',
    value: 'Minutes',
  },
  {
    id: 2,
    label: 'Hours',
    value: 'Hours',
  },
  {
    id: 3,
    label: 'Days',
    value: 'Days',
  },
  {
    id: 4,
    label: 'Weeks',
    value: 'Weeks',
  },
  {
    id: 5,
    label: 'Months',
    value: 'Months',
  }
];

const inputValuePath = 'holdShelfExpiryPeriod.duration';

const selectValuePath = 'holdShelfExpiryPeriod.intervalId';

const selectPlaceholder = 'ui-tenant-settings.settings.servicePoint.selectInterval';

const changeFormValueMock = jest.fn();

const fieldLabel = 'ui-tenant-settings.settings.servicePoint.expirationPeriod';

const renderPeriod = () => render(
  <Form
    onSubmit={() => {}}
    mutators={{ ...arrayMutators }}
    render={() => (
      <Period
        fieldLabel={fieldLabel}
        changeFormValue={changeFormValueMock}
        selectPlaceholder={selectPlaceholder}
        selectValuePath={selectValuePath}
        inputValuePath={inputValuePath}
        entity={entityMock}
        intervalPeriods={intervalPeriods}
      />
    )}
  />

);
describe('Period', () => {
  it('should render changed value in input', () => {
    renderPeriod();

    const input = screen.getByRole('spinbutton');

    userEvent.type(input, '-123');

    userEvent.clear(input);

    userEvent.type(input, '123');

    expect(input).toHaveValue(123);
  });

  it('should render changed option', () => {
    renderPeriod();

    const select = screen.getByRole('combobox');

    userEvent.selectOptions(
      select,
      screen.getByRole('option', { name: 'Days' }),
    );
  });
});
