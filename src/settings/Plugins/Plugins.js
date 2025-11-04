import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { map } from 'lodash';
import { useQueryClient } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import { modules } from 'stripes-config'; // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies
import {
  Callout,
  Layout,
} from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import PluginForm from './PluginForm';
import { useConfigurationsCreate } from '../../hooks/useConfigurationsCreate';
import { useConfigurationsUpdate } from '../../hooks/useConfigurationsUpdate';
import { CONFIGURATIONS, useConfigurations } from '../../hooks/useConfigurations';

const scope = 'ui-tenant-settings.plugins.manage';

const Plugins = ({ label }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const queryClient = useQueryClient();
  const callout = useRef(null);

  const { configs } = useConfigurations({
    searchParams: {
      query: `(scope=${scope})`,
      limit: '1000',
    },
  });

  const sharedOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries(CONFIGURATIONS);
    },
  };

  const { createConfiguration } = useConfigurationsCreate(sharedOptions);
  const { updateConfiguration } = useConfigurationsUpdate(sharedOptions);

  const pluginTypes = (() => {
    const plugins = modules.plugin || [];
    return plugins.reduce((pt, plugin) => {
      const type = plugin.pluginType;
      pt[type] = pt[type] || [];
      pt[type].push(plugin);
      return pt;
    }, {});
  })();

  const getPlugins = (settings) => {
    const pluginsByType = settings.reduce((memo, setting) => {
      memo[setting.key] = setting;
      return memo;
    }, {});

    return map(pluginTypes, (types, key) => {
      const plugin = pluginsByType[key];
      return plugin || { key };
    });
  };

  const savePlugin = (plugin) => {
    const value = plugin.value;
    if (plugin.id) {
      updateConfiguration({
        id: plugin.id,
        data: plugin
      });
    } else {
      createConfiguration({
        data: {
          id: uuidv4(),
          scope,
          key: plugin.key,
          value,
        },
      });
    }

    stripes.setSinglePlugin(plugin.key, value);
  };

  const save = (data) => {
    data.plugins.forEach(p => savePlugin(p));
    const updateMsg = <FormattedMessage id="ui-tenant-settings.settings.updated" />;
    callout.current.sendCallout({ message: updateMsg });
  };

  const plugins = getPlugins(configs);
  const isReadOnly = !stripes.hasPerm('ui-tenant-settings.settings.plugins');

  return (
    <Layout className="full">
      <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.plugins.title' })}>
        <PluginForm
          label={label}
          pluginTypes={pluginTypes}
          initialValues={{ plugins }}
          onSubmit={save}
          readOnly={isReadOnly}
        />
      </TitleManager>
      <Callout ref={callout} />
    </Layout>
  );
};

Plugins.propTypes = {
  label: PropTypes.node.isRequired,
};

export default Plugins;
