import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useRemoteStorageMappings } from './useRemoteStorageMappings';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = { limit: 10, offset: 0 };
const data = [{ id }];

describe('useRemoteStorageMappings', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({ mappings: data }),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return remote storage mappings', async () => {
    const { result } = renderHook(() => useRemoteStorageMappings({ searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isMappingsLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('remote-storage/mappings', { searchParams });
    expect(result.current.mappings).toEqual(data);
  });
});
