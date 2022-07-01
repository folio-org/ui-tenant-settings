import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';
import { FormattedMessage } from 'react-intl';
import { TextField } from '@folio/stripes/components';

import { renderWithRouter } from '../../../test/jest/helpers';

import RepeatableField from '.';

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const renderRepeatableField = (newItemTemplate) => renderWithRouter(
  <Form
    onSubmit={() => {}}
  >
    <RepeatableField
      addLabel={
        <div icon="plus-sign">
          <FormattedMessage id="ui-tenant-settings.settings.location.locations.addDetails" />
        </div>
      }
      name="RepeatableField"
      addButtonId="clickable-add-location-details"
      template={[
        {
          name: 'name',
          label: <FormattedMessage id="ui-tenant-settings.settings.location.locations.detailsName" />,
          component: TextField,
          renderValue: item => item || '',
          withFinalForm: true,
          value: 'old value'
        },
        {
          name: 'value',
          label: <FormattedMessage id="ui-tenant-settings.settings.location.locations.detailsValue" />,
          component: TextField,
          value: 'old value'
        },
      ]}
      newItemTemplate={newItemTemplate}
    />
  </Form>

);

describe('RepeatableField', () => {
  it('should render RepeatableField label', () => {
    renderRepeatableField({ name: '', value: '' });

    userEvent.click(screen.getByRole('button'));

    const inputs = [
      /settings.location.locations.detailsName/,
      /location.locations.detailsValue/
    ];

    inputs.forEach((el) => userEvent.type(screen.getByRole('textbox', { name: el }), 'New value'));

    inputs.forEach((el) => expect(screen.getByRole('textbox', { name: el })).toHaveValue('New value'));

    const clearButtons = screen.getAllByRole('button', { name: /stripes-components.clearThisField/ });

    clearButtons.forEach((el) => userEvent.click(el));

    userEvent.click(screen.getByRole('button', { name: 'Icon' }));
  });

  it('should render RepeatableField label', () => {
    renderRepeatableField();

    userEvent.click(screen.getByRole('button'));

    const inputs = [
      /settings.location.locations.detailsName/,
      /location.locations.detailsValue/
    ];

    inputs.forEach((el) => userEvent.type(screen.getByRole('textbox', { name: el }), 'New value'));

    inputs.forEach((el) => expect(screen.getByRole('textbox', { name: el })).toHaveValue('New value'));

    const clearButtons = screen.getAllByRole('button', { name: /stripes-components.clearThisField/ });

    clearButtons.forEach((el) => userEvent.click(el));

    userEvent.click(screen.getByRole('button', { name: 'Icon' }));
  });

  it('should add new field button', () => {
    renderRepeatableField();
    const addLocDetailsButton = screen.getByRole('button', { name: /locations.addDetails/ });

    userEvent.click(addLocDetailsButton);
    userEvent.click(screen.getByRole('button', { name: 'ui-tenant-settings.settings.location.locations.addDetails' }));

    const removeFieldButton = screen.getAllByRole('button', { name: /Icon/ });
    userEvent.click(removeFieldButton[0]);
    expect(screen.getByText(/has been removed/)).toBeVisible();
  });
});
