import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const CAMPUSES = 'CAMPUSES';

export const useCampuses = ({ searchParams }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: CAMPUSES });

  const { data, isLoading: isCampusesLoading } = useQuery({
    queryKey: [CAMPUSES, namespaceKey, searchParams],
    queryFn: () => ky.get('location-units/campuses', { searchParams }).json(),
  });

  return {
    campuses: data?.loccamps || [],
    isCampusesLoading,
  };
};
