import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useRemoteStorageConfigurations } from './useRemoteStorageConfigurations';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = { limit: 10, offset: 0 };
const data = [{ id }];

describe('useRemoteStorageConfigurations', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({ configurations: data }),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return configuration entries', async () => {
    const { result } = renderHook(() => useRemoteStorageConfigurations({ searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isConfigurationsLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('remote-storage/configurations', { searchParams });
    expect(result.current.configurations).toEqual(data);
  });
});
