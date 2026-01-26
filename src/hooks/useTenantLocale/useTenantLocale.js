import {
  useQuery,
  useMutation,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const TENANT_LOCALE_KEY = 'tenantLocale';

export const useTenantLocale = ({
  onUpdateSuccess,
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: TENANT_LOCALE_KEY });

  const { data: tenantLocale, refetch, isLoading: isLoadingTenantLocale } = useQuery({
    queryKey: [namespace],
    queryFn: () => ky.get('locale').json(),
  });

  const { mutateAsync: updateTenantLocale, isLoading: isUpdatingTenantLocale } = useMutation({
    mutationFn: ({ data }) => ky.put('locale', { json: data }),
    onSuccess: () => {
      refetch();
      onUpdateSuccess();
    },
  });

  return {
    tenantLocale,
    isLoadingTenantLocale,
    updateTenantLocale,
    isUpdatingTenantLocale,
  };
};
