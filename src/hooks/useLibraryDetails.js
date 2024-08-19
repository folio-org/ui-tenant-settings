import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const LIBRARY_DETAILS = 'LIBRARY_DETAILS';

export const useLibraryDetails = ({ id, searchParams }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: LIBRARY_DETAILS });

  const { data, isLoading: isCampusLoading } = useQuery({
    queryKey: [LIBRARY_DETAILS, namespaceKey, id, searchParams],
    queryFn: () => ky.get(`location-units/libraries/${id}`, { searchParams }).json(),
    enabled: !!id,
  });

  return {
    library: data,
    isCampusLoading,
  };
};
