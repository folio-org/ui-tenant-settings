import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { ConfigManager } from '@folio/stripes/smart-components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import LocaleForm from './LocaleForm';
import { parseSerializedLocale, serializeLocale } from './localeHelpers';


const Locale = ({ label, ...rest }) => {
  const intl = useIntl();
  const stripes = useStripes();

  const ConnectedConfigManager = stripes.connect(ConfigManager);

  const afterSave = (setting) => {
    const localeValues = JSON.parse(setting.value);
    const { locale, timezone, currency } = localeValues;

    setTimeout(() => {
      if (locale) stripes.setLocale(locale);
      if (timezone) stripes.setTimezone(timezone);
      if (currency) stripes.setCurrency(currency);
    }, 2000);
  };

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.locale.title' })}>
      <ConnectedConfigManager
        label={label}
        moduleName="ORG"
        configName="localeSettings"
        onBeforeSave={serializeLocale}
        onAfterSave={afterSave}
        configFormComponent={LocaleForm}
        getInitialValues={parseSerializedLocale}
        {...rest}
      />
    </TitleManager>
  );
};

Locale.propTypes = {
  label: PropTypes.node.isRequired,
};

export default Locale;
