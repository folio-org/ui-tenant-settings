import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useCampusDetails } from './useCampusDetails';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = {};
const data = { id };

describe('useCampusDetails', () => {
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

  it('should return campus details', async () => {
    const { result } = renderHook(() => useCampusDetails({ id, searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isCampusLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(`location-units/campuses/${id}`, { searchParams });
    expect(result.current.campus).toEqual(data);
  });
});
