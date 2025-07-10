import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useSamlConfiguration } from './useSamlConfiguration';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = {};
const data = { id };

describe('useSamlConfiguration', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve(data),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return SAML configuration', async () => {
    const { result } = renderHook(() => useSamlConfiguration({ id, searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isSamlConfigurationLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('saml/configuration', { searchParams });
    expect(result.current.samlConfig).toEqual(data);
  });
});
