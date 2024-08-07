import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useLocationCreate = (options) => {
  const ky = useOkapiKy();

  const { mutateAsync: createLocation, isLoading: isCreatingLocation } = useMutation({
    mutationFn: ({ data }) => ky.post('locations', { json: data }).json(),
    ...options,
  });

  return {
    createLocation,
    isCreatingLocation,
  };
};
