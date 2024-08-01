import React, {
  useContext,
  createContext,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';

import { useRemoteStorageConfigurations } from '../../../hooks/useRemoteStorageConfigurations';
import { useRemoteStorageMappingUpdate } from '../../../hooks/useRemoteStorageMappingUpdate';
import { useRemoteStorageMappingDelete } from '../../../hooks/useRemoteStorageMappingDelete';
import { useRemoteStorageMappings } from '../../../hooks/useRemoteStorageMappings';


const Context = createContext({});

export const useRemoteStorageApi = () => useContext(Context);

export const RemoteStorageApiProvider = (props) => {
  const stripes = useStripes();

  const {
    configurations,
    isConfigurationsLoading,
    isConfigurationsError
  } = useRemoteStorageConfigurations({
    searchParams: {
      limit: 10000
    },
    options: {
      enabled: stripes.hasInterface('remote-storage-configurations'),
    }
  });

  const {
    mappings,
    isMappingsLoading,
    isMappingsError
  } = useRemoteStorageMappings({
    searchParams: {
      limit: 10000
    },
    options: {
      enabled: stripes.hasInterface('remote-storage-mappings'),
    }
  });

  const { updateMapping } = useRemoteStorageMappingUpdate();
  const { deleteMapping } = useRemoteStorageMappingDelete();

  const { formatMessage } = useIntl();
  const translate = key => formatMessage({ id: `ui-tenant-settings.settings.location.remotes.${key}` });

  const remoteMap = useMemo(
    () => Object.fromEntries(mappings.map(
      ({ folioLocationId, configurationId }) => [folioLocationId, configurationId]
    )),
    [mappings]
  );

  const setMapping = ({ folioLocationId, configurationId }) => {
    if (!stripes.hasInterface('remote-storage-mappings') || (remoteMap[folioLocationId] === configurationId)) {
      return Promise.resolve();
    }

    if (configurationId) {
      return updateMapping({
        data: { folioLocationId, configurationId }
      });
    }

    return deleteMapping({ folioLocationId });
  };

  const context = {
    remoteMap,
    mappings,
    isMappingsLoading,
    isMappingsError,
    configurations,
    isConfigurationsLoading,
    isConfigurationsError,
    setMapping,
    translate,
  };

  return <Context.Provider value={context} {...props} />;
};
