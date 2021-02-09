import { useMutation, useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { SCHEDULE_PERIODS } from './BursarExportsConfiguration';

const bursarConfigApi = 'batch-voucher/export-configurations';

export const useBursarConfigQuery = (key = 'bursarConfig') => {
  const ky = useOkapiKy();

  const { isLoading, data = {} } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { records = [] } = await ky.get(bursarConfigApi).json();

      return records[0] || {
        schedulePeriod: SCHEDULE_PERIODS.none,
      };
    },
  });

  return {
    isLoading,
    bursarConfig: {
      ...data,
      weekDays: data.weekDays?.reduce((acc, weekDay) => ({
        ...acc,
        [weekDay.toLowerCase()]: true,
      }), {}),
    },
  };
};

export const useBursarConfigMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (bursarConfig) => {
      const { weekDays = {} } = bursarConfig;

      const json = {
        ...bursarConfig,
        weekDays: Object.keys(weekDays)
          .filter(weekDay => weekDays[weekDay])
          .map(weekDay => weekDay.toUpperCase()),
      };

      const kyMethod = bursarConfig.id ? 'put' : 'post';
      const kyPath = bursarConfig.id ? `${bursarConfigApi}/${bursarConfig.id}` : bursarConfigApi;

      return ky[kyMethod](kyPath, { json });
    },
    ...options,
  });

  return {
    mutateBursarConfig: mutateAsync,
  };
};

export const usePatronGroupsQuery = () => {
  const ky = useOkapiKy();

  const { isLoading, data = [] } = useQuery({
    queryKey: 'patronGroups',
    queryFn: async () => {
      const { usergroups = [] } = await ky.get('groups').json();

      return usergroups;
    },
  });

  return {
    isLoading,
    patronGroups: data,
  };
};
