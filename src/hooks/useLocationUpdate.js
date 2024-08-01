import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useLocationUpdate = (options) => {
  const ky = useOkapiKy();

  const { mutateAsync: updateLocation, isLoading: isUpdatingLocation } = useMutation({
    mutationFn: ({ locationId, data }) => ky.put(`locations/${locationId}`, { json: data }).json(),
    ...options,
  });

  return {
    updateLocation,
    isUpdatingLocation,
  };
};
