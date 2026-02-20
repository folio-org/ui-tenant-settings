import React from 'react';

import {
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import {
  withStripes,
  renderWithRouter
} from '../../../test/jest/helpers';

import Locale from './Locale';

const setCurrency = jest.fn();
const setLocale = jest.fn();
const setTimezone = jest.fn();

const LocaleWithStripes = withStripes(Locale, {
  stripes: {
    setCurrency,
    setLocale,
    setTimezone,
  },
  resources: {
    settings: {
      hasLoaded: true,
      records: [{ configName: 'bindings', module: 'ORG', value: '' }],
    },
  },
});

const renderLocale = (props) => renderWithRouter(<LocaleWithStripes {...props} />);

describe.skip('Locale', () => {
  afterEach(() => {
    setCurrency.mockClear();
    setLocale.mockClear();
    setTimezone.mockClear();
  });

  it('should render localization form', async () => {
    const { findAllByText } = renderLocale({ label: 'binding' });
    expect(await findAllByText('binding')).toBeDefined();
  });

  it('should choose and save locale', async () => {
    jest.useFakeTimers();

    renderLocale({ label: 'binding' });

    await act(async () => {
      const localeSelect = screen.getByRole('combobox', { name: /settings.localization/ });
      const nuSelect = screen.getByRole('combobox', { name: /settings.numberingSystem/ });
      const timezoneSelect = screen.getByRole('combobox', { name: /settings.timeZonePicker/ });
      const select = screen.getByRole('combobox', { name: /settings.primaryCurrency/ });
      const saveButton = screen.getByRole('button', { name: 'stripes-core.button.save' });

      userEvent.selectOptions(localeSelect, 'ar');
      userEvent.selectOptions(nuSelect, 'arab');
      userEvent.selectOptions(timezoneSelect, 'America/New_York');
      userEvent.selectOptions(select, 'EUR (EUR)');

      await waitFor(() => expect(saveButton).toBeEnabled());
      userEvent.click(saveButton);
    });

    jest.advanceTimersByTime(500);

    expect(setCurrency).toHaveBeenCalledTimes(1);
    expect(setLocale).toHaveBeenCalledTimes(1);
    expect(setTimezone).toHaveBeenCalledTimes(1);
  });
});
