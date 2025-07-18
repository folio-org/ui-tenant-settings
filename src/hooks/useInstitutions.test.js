import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useInstitutions } from './useInstitutions';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = { limit: 10, offset: 0 };
const data = [{ id }];

describe('useInstitutions', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({ locinsts: data }),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return institutions records', async () => {
    const { result } = renderHook(() => useInstitutions({ searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isInstitutionsLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('location-units/institutions', { searchParams });
    expect(result.current.institutions).toEqual(data);
  });
});
