import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useLibraries } from './useLibraries';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = { limit: 10, offset: 0 };
const data = [{ id }];

describe('useLibraries', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({ loclibs: data }),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return libraries records', async () => {
    const { result } = renderHook(() => useLibraries({ searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isLibrariesLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('location-units/libraries', { searchParams });
    expect(result.current.libraries).toEqual(data);
  });
});
