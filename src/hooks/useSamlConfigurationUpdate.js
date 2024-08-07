import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useSamlConfigurationUpdate = (options) => {
  const ky = useOkapiKy();

  const { mutateAsync: updateSamlConfiguration, isLoading: isUpdatingSamlConfiguration } = useMutation({
    mutationFn: ({ data }) => ky.put('saml/configuration', { json: data }).json(),
    ...options,
  });

  return {
    updateSamlConfiguration,
    isUpdatingSamlConfiguration,
  };
};
