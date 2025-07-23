import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useInstitutionDetails } from './useInstitutionDetails';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = {};
const data = { id };

describe('useInstitutionDetails', () => {
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

  it('should return institution details', async () => {
    const { result } = renderHook(() => useInstitutionDetails({ id, searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isInstitutionLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(`location-units/institutions/${id}`, { searchParams });
    expect(result.current.institution).toEqual(data);
  });
});
