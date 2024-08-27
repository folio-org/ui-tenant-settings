import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { getEcsTlrFeature } from '../../settings/ServicePoints/utils';

const useCirculationSettingsEcsTlrFeature = (enabled) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'circulationSettingsEcsTlrFeature' });
  const searchParams = {
    query: 'name==ecsTlrFeature',
  };
  const { isLoading, data, refetch, isFetching } = useQuery(
    [namespace],
    () => ky.get('circulation/settings', { searchParams }).json(),
    { enabled },
  );

  return ({
    titleLevelRequestsFeatureEnabled: getEcsTlrFeature(data?.circulationSettings),
    isLoading,
    isFetching,
    refetch,
  });
};

export default useCirculationSettingsEcsTlrFeature;
