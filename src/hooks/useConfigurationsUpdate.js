import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useConfigurationsUpdate = (options) => {
  const ky = useOkapiKy();

  const { mutateAsync: updateConfiguration, isLoading: isUpdatingConfiguration } = useMutation({
    mutationFn: ({ id, data }) => ky.put(`settings/entries/${id}`, { json: data }).json(),
    ...options,
  });

  return {
    updateConfiguration,
    isUpdatingConfiguration,
  };
};
