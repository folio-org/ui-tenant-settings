import {
  useQuery,
  useMutation,
} from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

const TENANT_LOCALE_KEY = 'tenantLocale';

export const useTenantLocale = ({
  onUpdateSuccess,
}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: TENANT_LOCALE_KEY });

  const isLocaleApiAvailable = stripes.hasInterface('locale');

  const { data: tenantLocale, refetch, isLoading: isLoadingTenantLocale } = useQuery({
    queryKey: [namespace],
    queryFn: () => ky.get('locale').json(),
  }, {
    enabled: isLocaleApiAvailable,
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
    // for some reason react-query returns isLoading as true even for disabled queries...this is an expected behaviour according to them
    // so we need to also check for a present interface to not have false positives
    isLoadingTenantLocale: isLoadingTenantLocale && isLocaleApiAvailable,
    updateTenantLocale,
    isUpdatingTenantLocale,
  };
};
