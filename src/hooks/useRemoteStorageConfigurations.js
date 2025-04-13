import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const REMOTE_STORAGE_CONFIGURATIONS = 'REMOTE_STORAGE_CONFIGURATIONS';

export const useRemoteStorageConfigurations = ({ searchParams, options = {} }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: REMOTE_STORAGE_CONFIGURATIONS });

  const { data, isLoading: isConfigurationsLoading, isError: isConfigurationsError } = useQuery({
    queryKey: [REMOTE_STORAGE_CONFIGURATIONS, namespaceKey, searchParams],
    queryFn: () => ky.get('remote-storage/configurations', { searchParams }).json(),
    ...options,
  });

  return {
    configurations: data?.configurations || [],
    isConfigurationsLoading,
    isConfigurationsError,
  };
};
