import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useSamlDownload } from './useSamlDownload';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = { id: '12345' };

describe('useSamlDownload', () => {
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

  it('should download SAML configuration', async () => {
    const { result } = renderHook(() => useSamlDownload(), { wrapper });

    await result.current.downloadFile();
    await waitFor(() => expect(result.current.isSamlDownloadLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith('saml/regenerate');
    expect(result.current.fileData).toEqual(data);
  });
});
