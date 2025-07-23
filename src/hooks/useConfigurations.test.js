import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useConfigurations } from './useConfigurations';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const id = '12345';
const searchParams = { limit: 10, offset: 0 };
const data = [{ id }];

describe('useConfigurations', () => {
  const kyMock = {
    get: jest.fn(() => ({
      json: () => Promise.resolve({ configs: data }),
    })),
  };

  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return configuration entries', async () => {
    const { result } = renderHook(() => useConfigurations({ searchParams }), { wrapper });

    await waitFor(() => expect(result.current.isConfigsLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('configurations/entries', { searchParams });
    expect(result.current.configs).toEqual(data);
  });
});
