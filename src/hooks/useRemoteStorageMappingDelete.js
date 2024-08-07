import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useRemoteStorageMappingDelete = (options) => {
  const ky = useOkapiKy();

  const { mutateAsync: deleteMapping, isLoading: isDeletingMapping } = useMutation({
    mutationFn: ({ folioLocationId }) => ky.delete(`remote-storage/mappings/${folioLocationId}`),
    ...options,
  });

  return {
    deleteMapping,
    isDeletingMapping,
  };
};
