import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const SAML_CONFIGURATION = 'SAML_CONFIGURATION';

export const useSamlConfiguration = ({ searchParams } = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: SAML_CONFIGURATION });

  const { data, isLoading: isSamlConfigurationLoading } = useQuery({
    queryKey: [SAML_CONFIGURATION, namespaceKey, searchParams],
    queryFn: () => ky.get('saml/configuration', { searchParams }).json(),
  });

  return {
    samlConfig: data || {},
    isSamlConfigurationLoading,
  };
};
