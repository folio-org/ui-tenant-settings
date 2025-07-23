import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useCampuses } from './useCampuses';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = { limit: 10, offset: 0 };
const data = [{ id }];

describe('useCampuses', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({ loccamps: data }),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return campuses records', async () => {
    const { result } = renderHook(() => useCampuses({ searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isCampusesLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('location-units/campuses', { searchParams });
    expect(result.current.campuses).toEqual(data);
  });
});
