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
 * Parse a JSON string into an object with the following keys:
 * locale, numberingSystem, timezone, and currency, providing
 * defaults for all except numberingSystem if they are not
 * present in the input.
 *
 * @param {string} serialized JSON
 * @returns
 */
export const parseSerializedLocale = (settings) => {
  const value = settings.length === 0 ? '' : settings[0].value;
  const defaultConfig = { locale: 'en-US', timezone: 'UTC', currency: 'USD' };
  let config;

  try {
    config = { ...defaultConfig, ...JSON.parse(value) };

    // a numbering system may be glommed onto the locale.
    // separate it if so, allowing the locale and numbering system
    // to be configured independently. this parsing is pretty brain-dead
    // right now and proper locale-value parsing will need to be
    // implemented if we choose to support for additional options.
    if (config.locale) {
      const parts = config.locale.split('-u-nu-');
      config.locale = parts[0];
      if (parts[1]) {
        config.numberingSystem = parts[1];
      }
    }
  } catch (e) {
    config = defaultConfig;
  }

  return config;
};

/**
 * Concatenate locale and numbering system, if the latter is present,
 * into a correctly formatted locale string. Serialize the lot and return it.
 *
 * @param {object} shaped like locale, numberingSystem?, timezone, currency
 * @returns {string}
 */
export const serializeLocale = (data) => {
  const { locale: rawLocale, numberingSystem, timezone, currency } = data;

  // A numbering system other than the locale's default may be configured with `-u-nu-SYSTEM`
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem
  const locale = numberingSystem ? `${rawLocale}-u-nu-${numberingSystem}` : rawLocale;

  return JSON.stringify({ locale, timezone, currency });
};
