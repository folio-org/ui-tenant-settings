import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useRemoteStorageMappingUpdate = (options) => {
  const ky = useOkapiKy();

  const { mutateAsync: updateMapping, isLoading: isUpdatingMapping } = useMutation({
    mutationFn: ({ data }) => ky.post('remote-storage/mappings', { json: data }).json(),
    ...options,
  });

  return {
    updateMapping,
    isUpdatingMapping,
  };
};
