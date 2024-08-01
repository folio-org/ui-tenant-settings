import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const INSTITUTION_DETAILS = 'INSTITUTION_DETAILS';

export const useInstitutionDetails = ({ id, searchParams }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: INSTITUTION_DETAILS });

  const { data, isLoading: isInstitutionLoading } = useQuery({
    queryKey: [INSTITUTION_DETAILS, namespaceKey, id, searchParams],
    queryFn: () => ky.get(`location-units/institutions/${id}`, { searchParams }).json(),
    enabled: !!id,
  });

  return {
    institution: data,
    isInstitutionLoading,
  };
};
