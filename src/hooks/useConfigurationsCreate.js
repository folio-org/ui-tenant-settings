import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useConfigurationsCreate = (options) => {
  const ky = useOkapiKy();

  const { mutateAsync: createConfiguration, isLoading: isCreatingConfiguration } = useMutation({
    mutationFn: ({ data }) => ky.post('settings/entries', { json: data }).json(),
    ...options,
  });

  return {
    createConfiguration,
    isCreatingConfiguration,
  };
};
