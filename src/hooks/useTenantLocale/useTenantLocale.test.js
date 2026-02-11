import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  useOkapiKy,
  useNamespace,
  useStripes,
} from '@folio/stripes/core';


import { buildStripes } from '../../../test/jest/__mocks__/stripesCore.mock';
import { useTenantLocale } from './useTenantLocale';

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: jest.fn(),
  useNamespace: jest.fn(),
  useStripes: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

useStripes.mockReturnValue(buildStripes({
  hasInterface: () => true,
}));

describe('useTenantLocale', () => {
  const mockLocaleData = {
    locale: 'en-US',
    numberingSystem: 'latn',
    timezone: 'America/New_York',
    currency: 'USD',
  };

  const kyMock = {
    get: jest.fn(),
    put: jest.fn(),
  };

  const onUpdateSuccess = jest.fn();

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
    useNamespace.mockReturnValue(['tenantLocale']);

    kyMock.get.mockReturnValue({
      json: () => Promise.resolve(mockLocaleData),
    });

    kyMock.put.mockReturnValue({
      json: () => Promise.resolve(mockLocaleData),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when fetching tenant locale data', () => {
    it('should fetch data on mount', async () => {
      const { result } = renderHook(() => useTenantLocale({ onUpdateSuccess }), { wrapper });

      await waitFor(() => expect(result.current.isLoadingTenantLocale).toBeFalsy());

      expect(kyMock.get).toHaveBeenCalledWith('locale');
      expect(result.current.tenantLocale).toEqual(mockLocaleData);
    });
  });

  describe('when updating tenant locale', () => {
    it('should call the correct API endpoint with data', async () => {
      const { result } = renderHook(() => useTenantLocale({ onUpdateSuccess }), { wrapper });

      await waitFor(() => expect(result.current.isLoadingTenantLocale).toBeFalsy());

      const updatedLocaleData = {
        locale: 'ar',
        numberingSystem: 'arab',
        timezone: 'America/Cairo',
        currency: 'EGP',
      };

      await act(async () => {
        await result.current.updateTenantLocale({ data: updatedLocaleData });
      });

      expect(kyMock.put).toHaveBeenCalledWith('locale', { json: updatedLocaleData });
    });

    it('should call onUpdateSuccess callback', async () => {
      const { result } = renderHook(() => useTenantLocale({ onUpdateSuccess }), { wrapper });

      await waitFor(() => expect(result.current.isLoadingTenantLocale).toBeFalsy());

      const updatedLocaleData = {
        locale: 'fr-FR',
        numberingSystem: 'latn',
        timezone: 'Europe/Paris',
        currency: 'EUR',
      };

      await act(async () => {
        await result.current.updateTenantLocale({ data: updatedLocaleData });
      });

      await waitFor(() => expect(onUpdateSuccess).toHaveBeenCalled());
    });

    it('should refetch data after successful update', async () => {
      const { result } = renderHook(() => useTenantLocale({ onUpdateSuccess }), { wrapper });

      await waitFor(() => expect(result.current.isLoadingTenantLocale).toBeFalsy());

      const initialCallCount = kyMock.get.mock.calls.length;

      const updatedLocaleData = {
        locale: 'de-DE',
        numberingSystem: 'latn',
        timezone: 'Europe/Berlin',
        currency: 'EUR',
      };

      await act(async () => {
        await result.current.updateTenantLocale({ data: updatedLocaleData });
      });

      await waitFor(() => {
        expect(kyMock.get.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });
});
