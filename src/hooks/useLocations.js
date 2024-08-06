import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const LOCATIONS = 'LOCATIONS';

export const useLocations = ({ searchParams }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: LOCATIONS });

  const { data, isLoading: isLocationsLoading, refetch } = useQuery({
    queryKey: [LOCATIONS, namespaceKey, searchParams],
    queryFn: () => ky.get('locations', { searchParams }).json(),
  });

  return {
    locations: data?.locations || [],
    isLocationsLoading,
    refetch,
  };
};
