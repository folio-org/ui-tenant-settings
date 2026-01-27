/**
 * Merges input settings with default configuration values.
 *
 * @param {Object} settings - An object with locale settings.
 * @returns {Object} The merged configuration object containing locale, timezone, currency, and optionally a numbering system.
 */
export const getInitialValues = (settings) => {
  const defaultConfig = { locale: 'en-US', timezone: 'UTC', currency: 'USD', numberingSystem: 'latn' };

  return {
    ...defaultConfig,
    ...settings,
  };
};

/**
 * @param {object} shaped like locale, numberingSystem?, timezone, currency
 * @returns {object} shaped like locale, numberingSystem?, timezone, currency
 */
export const beforeSave = (data) => {
  return data;
};
