import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  renderHook,
  act,
} from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import useCirculationSettingsEcsTlrFeature from './useCirculationSettingsEcsTlrFeature';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = 'data';

describe('useCirculationSettingsEcsTlrFeature', () => {
  it('should fetch data', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          data,
        }),
      }),
    });

    const { result } = renderHook(() => useCirculationSettingsEcsTlrFeature(true), { wrapper });

    await act(() => {
      return !result.current.isLoading;
    });

    expect(result.current.titleLevelRequestsFeatureEnabled).toBeFalsy();
  });
});
