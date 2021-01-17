import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

const Context = React.createContext({});

export const useRemoteStorageApi = () => React.useContext(Context);

const Provider = ({ resources, mutator, ...rest }) => {
  const [persistentMutator] = React.useState(mutator);

  React.useEffect(() => {
    persistentMutator.configurations.GET();
  }, [persistentMutator]);

  const { formatMessage } = useIntl();
  const translate = key => formatMessage({ id: `ui-tenant-settings.settings.location.remotes.${key}` });

  const remoteMap = React.useMemo(
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

  const context = {
    ...resources,
    remoteMap,
    setMapping,
    translate,
  };

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
  },
});

Provider.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export const RemoteStorageApiProvider = stripesConnect(Provider);
