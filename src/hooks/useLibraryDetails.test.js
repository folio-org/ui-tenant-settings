import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useLibraryDetails } from './useLibraryDetails';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = {};
const data = { id };

describe('useLibraryDetails', () => {
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

  it('should return library details', async () => {
    const { result } = renderHook(() => useLibraryDetails({ id, searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(`location-units/libraries/${id}`, { searchParams });
    expect(result.current.library).toEqual(data);
  });
});
