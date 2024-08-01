import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const CONFIGURATIONS = 'CONFIGURATIONS';

export const useConfigurations = ({ searchParams }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: CONFIGURATIONS });

  const { data, isLoading: isConfigsLoading } = useQuery({
    queryKey: [CONFIGURATIONS, namespaceKey, searchParams],
    queryFn: () => ky.get('configurations/entries', { searchParams }).json(),
  });

  return {
    configs: data?.configs || [],
    isConfigsLoading,
  };
};
