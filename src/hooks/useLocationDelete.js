import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useLocationDelete = (options) => {
  const ky = useOkapiKy();

  const { mutateAsync: deleteLocation, isLoading: isDeletingLocation } = useMutation({
    mutationFn: ({ locationId }) => ky.delete(`locations/${locationId}`),
    ...options,
  });

  return {
    deleteLocation,
    isDeletingLocation,
  };
};
