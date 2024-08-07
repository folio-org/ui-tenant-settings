import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import { TitleManager, useOkapiKy, useStripes } from '@folio/stripes/core';
import {
  Callout,
  Layout,
} from '@folio/stripes/components';

import { patronIdentifierTypes, samlBindingTypes } from '../../constants';
import SamlForm from './SamlForm';
import { SAML_CONFIGURATION, useSamlConfiguration } from '../../hooks/useSamlConfiguration';
import { useSamlConfigurationUpdate } from '../../hooks/useSamlConfigurationUpdate';


const SSOSettings = ({ label }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const queryClient = useQueryClient();
  const ky = useOkapiKy();
  const callout = useRef(null);
  const downloadButton = useRef(null);
  const isReadOnly = !stripes.hasPerm('ui-tenant-settings.settings.sso');

  const { samlConfig } = useSamlConfiguration();
  const { updateSamlConfiguration } = useSamlConfigurationUpdate({
    onSuccess: () => {
      callout.current.sendCallout({ message: <FormattedMessage id="ui-tenant-settings.settings.updated" /> });
      queryClient.invalidateQueries(SAML_CONFIGURATION);
    }
  });

  const updateSettings = (settings) => {
    updateSamlConfiguration({
      data: {
        ...settings,
        okapiUrl: stripes.okapi.url,
      }
    });
  };

  const validateIdpUrl = async (value) => {
    if (!value) {
      return <FormattedMessage id="ui-tenant-settings.settings.saml.validate.fillIn" />;
    }

    const error = <FormattedMessage id="ui-tenant-settings.settings.saml.validate.idpUrl" />;
    const searchParams = { type: 'idpurl', value };

    try {
      const result = await ky.get('saml/validate', { searchParams }).json();

      if (!result?.valid) {
        return error;
      }
    } catch (err) {
      return error;
    }

    return '';
  };

  return (
    <TitleManager stripes={stripes} page={intl.formatMessage({ id: 'ui-tenant-settings.settings.sso.title' })}>
      <Layout className="full">
        <SamlForm
          label={label}
          initialValues={samlConfig}
          onSubmit={(record) => { updateSettings(record); }}
          optionLists={{ identifierOptions: patronIdentifierTypes, samlBindingOptions: samlBindingTypes }}
          validateIdpUrl={validateIdpUrl}
          stripes={stripes}
          readOnly={isReadOnly}
        />
        <a // eslint-disable-line jsx-a11y/anchor-is-valid
          hidden
          ref={downloadButton}
        >
          <FormattedMessage id="ui-tenant-settings.settings.hiddenDownloadLink" />
        </a>
        <Callout ref={callout} />
      </Layout>
    </TitleManager>
  );
};

SSOSettings.propTypes = {
  label: PropTypes.node.isRequired,
};

export default SSOSettings;
