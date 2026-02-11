/**
 * Used for locale stored via mod-settings' /locale endpoint
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
 * Used for locale stored via mod-settings' /settings/entries endpoint
 * Merges input settings with default configuration values.
 *
 * The function extracts the `value` from the first element of the input array and merges it with the
 * default configuration object.
 *
 * @param {Array<Object>} settings - An array with at least one object containing a `value` property with locale settings.
 * @returns {Object} The merged configuration object containing locale, timezone, currency, and optionally a numbering system.
 */
export const getInitialValuesSettingsEntries = (settings) => {
  const setting = settings[0]?.value;
  const defaultConfig = { locale: 'en-US', timezone: 'UTC', currency: 'USD' };

  return {
    ...defaultConfig,
    ...setting,
  };
};

/**
 * @param {object} shaped like locale, numberingSystem?, timezone, currency
 * @returns {object} shaped like locale, numberingSystem?, timezone, currency
 */
export const beforeSave = (data) => {
  return data;
};
