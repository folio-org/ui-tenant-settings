import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useServicePoints } from './useServicePoints';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = { limit: 10, offset: 0 };
const data = [{ id }];

describe('useServicePoints', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({ servicepoints: data }),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return service points records', async () => {
    const { result } = renderHook(() => useServicePoints({ searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isServicePointsLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('service-points', { searchParams });
    expect(result.current.servicePoints).toEqual(data);
  });
});
