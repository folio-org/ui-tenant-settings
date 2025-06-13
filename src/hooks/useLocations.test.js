import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useLocations } from './useLocations';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = { limit: 10, offset: 0 };
const data = [{ id }];

describe('useLocations', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({ locations: data }),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return libraries records', async () => {
    const { result } = renderHook(() => useLocations({ searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isLocationsLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('locations', { searchParams });
    expect(result.current.locations).toEqual(data);
  });
});
