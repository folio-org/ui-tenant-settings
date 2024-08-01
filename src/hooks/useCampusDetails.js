import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const CAMPUS_DETAILS = 'CAMPUS_DETAILS';

export const useCampusDetails = ({ id, searchParams }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: CAMPUS_DETAILS });

  const { data, isLoading: isCampusLoading } = useQuery({
    queryKey: [CAMPUS_DETAILS, namespaceKey, id, searchParams],
    queryFn: () => ky.get(`location-units/campuses/${id}`, { searchParams }).json(),
    enabled: !!id,
  });

  return {
    campus: data,
    isCampusLoading,
  };
};
