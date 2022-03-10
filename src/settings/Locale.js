import React from 'react';
import PropTypes from 'prop-types';
import { ConfigManager } from '@folio/stripes/smart-components';

import LocaleForm from './LocaleForm';
import { parseSerializedLocale, serializeLocale } from './localeHelpers';

class Locale extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      setCurrency: PropTypes.func.isRequired,
      setLocale: PropTypes.func.isRequired,
      setTimezone: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
    this.afterSave = this.afterSave.bind(this);
  }

  afterSave(setting) {
    const localeValues = JSON.parse(setting.value);
    const { locale, timezone, currency } = localeValues;

    setTimeout(() => {
      if (locale) this.props.stripes.setLocale(locale);
      if (timezone) this.props.stripes.setTimezone(timezone);
      if (currency) this.props.stripes.setCurrency(currency);
    }, 500);
  }

  render() {
    return (
      <this.configManager
        label={this.props.label}
        moduleName="ORG"
        configName="localeSettings"
        onBeforeSave={serializeLocale}
        onAfterSave={this.afterSave}
        configFormComponent={LocaleForm}
        getInitialValues={parseSerializedLocale}
      />
    );
  }
}

export default Locale;
