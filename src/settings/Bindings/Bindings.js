import React from 'react';
import PropTypes from 'prop-types';

import { ConfigManager } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';

import BindingsForm from './BindingsForm';


const Bindings = ({ label }) => {
  const stripes = useStripes();
  const ConnectedConfigManager = stripes.connect(ConfigManager);

  const setBindings = (config) => {
    stripes.setBindings(JSON.parse(config.value));
  };

  return (
    <ConnectedConfigManager
      label={label}
      moduleName="ORG"
      configName="bindings"
      onAfterSave={setBindings}
      configFormComponent={BindingsForm}
    />
  );
};

Bindings.propTypes = {
  label: PropTypes.node.isRequired,
};

export default Bindings;
