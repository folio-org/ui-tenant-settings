import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const INSTITUTIONS = 'INSTITUTIONS';

export const useInstitutions = ({ searchParams }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: INSTITUTIONS });

  const { data, isLoading: isInstitutionsLoading } = useQuery({
    queryKey: [INSTITUTIONS, namespaceKey, searchParams],
    queryFn: () => ky.get('location-units/institutions', { searchParams }).json(),
  });

  return {
    institutions: data?.locinsts || [],
    isInstitutionsLoading,
  };
};
