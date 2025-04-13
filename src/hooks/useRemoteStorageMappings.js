import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const REMOTE_STORAGE_MAPPINGS = 'REMOTE_STORAGE_MAPPINGS';

export const useRemoteStorageMappings = ({ searchParams, options = {} }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: REMOTE_STORAGE_MAPPINGS });

  const { data, isLoading: isMappingsLoading, isError: isMappingsError } = useQuery({
    queryKey: [REMOTE_STORAGE_MAPPINGS, namespaceKey, searchParams],
    queryFn: () => ky.get('remote-storage/mappings', { searchParams }).json(),
    ...options,
  });

  return {
    mappings: data?.mappings || [],
    isMappingsLoading,
    isMappingsError,
  };
};
