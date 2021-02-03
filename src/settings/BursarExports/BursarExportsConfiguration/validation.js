import React from 'react';
import { FormattedMessage } from 'react-intl';

export function validateRequired(value) {
  return value ? undefined : <FormattedMessage id="ui-tenant-settings.settings.validation.required" />;
}
