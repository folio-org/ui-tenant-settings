import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

const Context = createContext({});

export const useRemoteStorageApi = () => useContext(Context);

const Provider = ({ resources, mutator, stripes, ...rest }) => {
  const [persistentMutator] = useState(mutator);
  const withRemoteStorage = stripes.hasInterface('remote-storage-configurations') && stripes.hasInterface('remote-storage-mappings');

  useEffect(() => {
    if (withRemoteStorage) {
      persistentMutator.configurations.reset();
      persistentMutator.configurations.GET();
    }
  }, [persistentMutator, withRemoteStorage]);

  const { formatMessage } = useIntl();
  const translate = key => formatMessage({ id: `ui-tenant-settings.settings.location.remotes.${key}` });

  const remoteMap = useMemo(
    () => Object.fromEntries(resources.mappings.records.map(
      ({ folioLocationId, configurationId }) => [folioLocationId, configurationId]
    )),
    [resources.mappings.records]
  );

  const setMapping = ({ folioLocationId, configurationId }) => {
    if (remoteMap[folioLocationId] === configurationId) return Promise.resolve();

    if (configurationId) return persistentMutator.mappings.POST({ folioLocationId, configurationId });

    return persistentMutator.mappings.DELETE({ folioLocationId, configurationId });
  };

  const context = withRemoteStorage ? {
    ...resources,
    remoteMap,
    setMapping,
    translate,
  } : {};

  return <Context.Provider value={context} {...rest} />;
};

Provider.manifest = Object.freeze({
  configurations: {
    type: 'okapi',
    path: 'remote-storage/configurations',
    accumulate: true,
    records: 'configurations',
    throwErrors: false,
  },
  mappings: {
    type: 'okapi',
    path: 'remote-storage/mappings',
    records: 'mappings',
    pk: 'folioLocationId',
    clientGeneratePk: false, // because we use POST instead of PUT for modification here (there's no PUT)
    throwErrors: false,
    fetch: ({ stripes }) => stripes.hasInterface('remote-storage-mappings'),
  },
});

Provider.propTypes = {
  mutator: PropTypes.object.isRequired,
  stripes: PropTypes.object,
};

export const RemoteStorageApiProvider = stripesConnect(Provider);
