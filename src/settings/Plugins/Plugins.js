import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { map, omit } from 'lodash';

import { modules } from 'stripes-config'; // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies
import {
  Callout,
  Layout,
} from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import PluginForm from './PluginForm';
import { useConfigurationsCreate } from '../../hooks/useConfigurationsCreate';
import { useConfigurationsUpdate } from '../../hooks/useConfigurationsUpdate';
import { useConfigurations } from '../../hooks/useConfigurations';


const Plugins = ({ label }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const callout = useRef(null);

  const { configs } = useConfigurations({
    searchParams: {
      query: '(module==PLUGINS) sortby configName',
      limit: '1000',
    },
  });
  const { createConfiguration } = useConfigurationsCreate();
  const { updateConfiguration } = useConfigurationsUpdate();

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
      memo[setting.configName] = setting;
      return memo;
    }, {});

    return map(pluginTypes, (types, key) => {
      const plugin = pluginsByType[key];
      return plugin || { configName: key };
    });
  };

  const savePlugin = (plugin) => {
    const value = plugin.value;
    if (plugin.id) {
      updateConfiguration({
        id: plugin.id,
        data: omit(plugin, ['metadata']),
      });
    } else {
      createConfiguration({
        data: {
          module: 'PLUGINS',
          configName: plugin.configName,
          value,
        },
      });
    }

    stripes.setSinglePlugin(plugin.configName, value);
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
