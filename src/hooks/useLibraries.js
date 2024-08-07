import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const LIBRARIES = 'LIBRARIES';

export const useLibraries = ({ searchParams }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: LIBRARIES });

  const { data, isLoading: isLibrariesLoading } = useQuery({
    queryKey: [LIBRARIES, namespaceKey, searchParams],
    queryFn: () => ky.get('location-units/libraries', { searchParams }).json(),
  });

  return {
    libraries: data?.loclibs || [],
    isLibrariesLoading,
  };
};
