import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { ConfigManager } from '@folio/stripes/smart-components';
import {
  TitleManager,
  useStripes,
  tenantLocaleConfig,
  getFullLocale,
} from '@folio/stripes/core';

import LocaleForm from './LocaleForm';
import {
  beforeSave,
  getInitialValues,
} from './localeHelpers';

const Locale = ({ label, ...rest }) => {
  const intl = useIntl();
  const stripes = useStripes();

  const ConnectedConfigManager = stripes.connect(ConfigManager);

  const afterSave = (setting) => {
    const {
      locale,
      numberingSystem,
      timezone,
      currency,
    } = setting.value;

    setTimeout(() => {
      if (locale) {
        const fullLocale = getFullLocale(locale, numberingSystem);

        stripes.setLocale(fullLocale);
      }

      if (timezone) stripes.setTimezone(timezone);
      if (currency) stripes.setCurrency(currency);
    }, 2000);
  };

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.locale.title' })}>
      <ConnectedConfigManager
        label={label}
        scope={tenantLocaleConfig.SCOPE}
        configName={tenantLocaleConfig.KEY}
        onBeforeSave={beforeSave}
        onAfterSave={afterSave}
        configFormComponent={LocaleForm}
        getInitialValues={getInitialValues}
        {...rest}
      />
    </TitleManager>
  );
};

Locale.propTypes = {
  label: PropTypes.node.isRequired,
};

export default Locale;
