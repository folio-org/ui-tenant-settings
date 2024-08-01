import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const SERVICE_POINTS = 'SERVICE_POINTS';

export const useServicePoints = ({ searchParams }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: SERVICE_POINTS });

  const { data, isLoading: isServicePointsLoading } = useQuery({
    queryKey: [SERVICE_POINTS, namespaceKey, searchParams],
    queryFn: () => ky.get('service-points', { searchParams }).json(),
  });

  return {
    servicePoints: data?.servicepoints || [],
    isServicePointsLoading,
  };
};
