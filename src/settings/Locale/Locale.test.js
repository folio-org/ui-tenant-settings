import React from 'react';
import {
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  useStripes,
  useCallout,
} from '@folio/stripes/core';

import {
  buildStripes,
  stripesConnect,
} from '../../../test/jest/__mocks__/stripesCore.mock';
import '../../../test/jest/__mocks__';
import { renderWithRouter } from '../../../test/jest/helpers';

import Locale from './Locale';
import { useTenantLocale } from '../../hooks/useTenantLocale';

jest.mock('../../hooks/useTenantLocale', () => ({
  useTenantLocale: jest.fn(),
}));

const setCurrency = jest.fn();
const setLocale = jest.fn();
const setTimezone = jest.fn();
const sendCallout = jest.fn();
const mockUpdateTenantLocale = jest.fn().mockResolvedValue({});

const mockTenantLocale = {
  locale: 'en-US',
  numberingSystem: 'latn',
  timezone: 'America/New_York',
  currency: 'USD',
};

const renderLocale = (props) => renderWithRouter(
  <Locale
    {...props}
  />
);

describe('Locale', () => {
  beforeAll(() => {
    useStripes.mockReturnValue(buildStripes({
      setCurrency,
      setLocale,
      setTimezone,
      connect: stripesConnect,
    }));

    useCallout.mockReturnValue({
      sendCallout,
    });

    useTenantLocale.mockReturnValue({
      tenantLocale: mockTenantLocale,
      isLoadingTenantLocale: false,
      updateTenantLocale: mockUpdateTenantLocale,
      isUpdatingTenantLocale: false,
    });
  });

  afterEach(() => {
    setCurrency.mockClear();
    setLocale.mockClear();
    setTimezone.mockClear();
    sendCallout.mockClear();
    mockUpdateTenantLocale.mockClear();
  });

  describe('when using locale API', () => {
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

      await waitFor(() => {
        expect(mockUpdateTenantLocale).toHaveBeenCalled();
      });

      jest.advanceTimersByTime(2000);

      expect(setCurrency).toHaveBeenCalledWith('EUR');
      expect(setLocale).toHaveBeenCalledWith('ar-u-nu-arab');
      expect(setTimezone).toHaveBeenCalledWith('America/New_York');
    });
  });
});
