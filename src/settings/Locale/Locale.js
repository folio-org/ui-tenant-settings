import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  TitleManager,
  useStripes,
  getFullLocale,
  useCallout,
} from '@folio/stripes/core';

import LocaleForm from './LocaleForm';
import { useTenantLocale } from '../../hooks/useTenantLocale';
import { getInitialValues } from './localeHelpers';

const Locale = ({ label }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const callout = useCallout();

  const {
    tenantLocale,
    isLoadingTenantLocale,
    updateTenantLocale,
  } = useTenantLocale({
    onUpdateSuccess: () => callout.sendCallout({ type: 'success', message: 'ui-tenant-settings.settings.locale.success' }),
  });

  const afterSave = useCallback((setting) => {
    const {
      locale,
      numberingSystem,
      timezone,
      currency,
    } = setting;

    setTimeout(() => {
      if (locale) {
        const fullLocale = getFullLocale(locale, numberingSystem);

        stripes.setLocale(fullLocale);
      }

      if (timezone) stripes.setTimezone(timezone);
      if (currency) stripes.setCurrency(currency);
    }, 2000);
  }, [stripes]);

  const onSave = useCallback(async (locale) => {
    await updateTenantLocale({ data: locale });

    afterSave(locale);
  }, [afterSave, updateTenantLocale]);

  if (isLoadingTenantLocale) {
    return null;
  }

  const initialValues = getInitialValues(tenantLocale);

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.locale.title' })}>
      <LocaleForm
        onSubmit={onSave}
        initialValues={initialValues}
        label={label}
      />
    </TitleManager>
  );
};

Locale.propTypes = {
  label: PropTypes.node.isRequired,
};

export default Locale;
