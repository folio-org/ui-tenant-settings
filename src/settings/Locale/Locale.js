import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  TitleManager,
  useStripes,
  getFullLocale,
  useCallout,
  tenantLocaleConfig,
} from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import LocaleForm from './LocaleForm';
import { useTenantLocale } from '../../hooks/useTenantLocale';
import {
  getInitialValues,
  getInitialValuesSettingsEntries,
  beforeSave,
} from './localeHelpers';

const Locale = ({ label }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const callout = useCallout();

  const isUsingLocaleApi = stripes.hasInterface('locale');

  const ConnectedConfigManager = stripes.connect(ConfigManager);

  const {
    tenantLocale,
    isLoadingTenantLocale,
    updateTenantLocale,
  } = useTenantLocale({
    onUpdateSuccess: () => callout.sendCallout({ type: 'success', message: 'ui-tenant-settings.settings.locale.success' }),
  });

  const afterSave = useCallback((setting) => {
    const localeValues = isUsingLocaleApi ? setting : setting.values;
    const {
      locale,
      numberingSystem,
      timezone,
      currency,
    } = localeValues;

    setTimeout(() => {
      if (locale) {
        const fullLocale = getFullLocale(locale, numberingSystem);

        stripes.setLocale(fullLocale);
      }

      if (timezone) stripes.setTimezone(timezone);
      if (currency) stripes.setCurrency(currency);
    }, 2000);
  }, [stripes, isUsingLocaleApi]);

  const onSave = useCallback(async (locale) => {
    await updateTenantLocale({ data: locale });

    afterSave(locale);
  }, [afterSave, updateTenantLocale]);

  const renderLocaleApiForm = useCallback(() => {
    const initialValues = getInitialValues(tenantLocale);

    return (
      <LocaleForm
        onSubmit={onSave}
        initialValues={initialValues}
        label={label}
      />
    );
  }, [label, onSave, tenantLocale]);

  const renderSettingsEntriesForm = useCallback(() => {
    return (
      <ConnectedConfigManager
        label={label}
        scope={tenantLocaleConfig.SCOPE}
        configName={tenantLocaleConfig.KEY}
        onBeforeSave={beforeSave}
        onAfterSave={afterSave}
        configFormComponent={LocaleForm}
        getInitialValues={getInitialValuesSettingsEntries}
      />
    );
  }, [label, afterSave]);


  if (isLoadingTenantLocale) {
    return null;
  }

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.locale.title' })}>
      {
        isUsingLocaleApi
          ? renderLocaleApiForm()
          : renderSettingsEntriesForm()
      }
    </TitleManager>
  );
};

Locale.propTypes = {
  label: PropTypes.node.isRequired,
};

export default Locale;
