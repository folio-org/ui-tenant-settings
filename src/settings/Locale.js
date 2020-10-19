import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, createIntl, createIntlCache } from 'react-intl';
import { Field } from 'redux-form';
import { translations } from 'stripes-config';


import { IfPermission, supportedLocales } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';
import { Button, Col, Row, Select, CurrencySelect } from '@folio/stripes/components';
import timezones from '../util/timezones';

const timeZonesList = timezones.map(timezone => (
  {
    value: timezone.value,
    label: timezone.value,
  }
));

const options = supportedLocales.map(k => ({ value: k, label: '' }));

class Locale extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      setLocale: PropTypes.func.isRequired,
      setTimezone: PropTypes.func.isRequired,
      setCurrency: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.node.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.configManager = props.stripes.connect(ConfigManager);
    this.setLocaleSettings = this.setLocaleSettings.bind(this);
    this.getInitialValues = this.getInitialValues.bind(this);
    this.beforeSave = this.beforeSave.bind(this);

    // This is optional but highly recommended
    // since it prevents memory leak
    const cache = createIntlCache();
    const { intl } = props;

    options.forEach(locale => {
      locale.intl = createIntl({
        locale: locale.value,
        messages: {}
      }, cache);

      // label contains language in current locale and in destination locale
      // e.g. given the current locale is `en` and the keys `ar` and `zh-CN` show:
      //     Arabic / العربية
      //     Chinese (China) / 中文（中国）
      // e.g. given the current locale is `ar` and the keys `ar` and `zh-CN` show:
      //    العربية / العربية
      //    الصينية (الصين) / 中文（中国）
      locale.label = `${intl.formatDisplayName(locale.value, { type: 'language' })} / ${locale.intl.formatDisplayName(locale.value, { type: 'language' })}`;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getInitialValues(settings) {
    const value = settings.length === 0 ? '' : settings[0].value;
    const defaultConfig = { locale: 'en-US', timezone: 'UTC', currency: 'USD' };
    let config;

    try {
      config = Object.assign({}, defaultConfig, JSON.parse(value));
    } catch (e) {
      config = defaultConfig;
    }

    return config;
  }

  setLocaleSettings(setting) {
    const localeValues = JSON.parse(setting.value);
    const { locale, timezone, currency } = localeValues;
    setTimeout(() => {
      if (locale) this.props.stripes.setLocale(locale);
      if (timezone) this.props.stripes.setTimezone(timezone);
      if (currency) this.props.stripes.setCurrency(currency);
    }, 2000);
  }

  // eslint-disable-next-line class-methods-use-this
  beforeSave(data) {
    const { locale, timezone, currency } = data;
    return JSON.stringify({ locale, timezone, currency });
  }

  handleLocaleChange = (event, newValue) => {
    const region = newValue.replace('-', '_');
    fetch(translations[region] ? translations[region] : translations.en_US)
      .then((response) => {
        if (response.ok) {
          response.json().then((values) => {
            let warning = values['ui-tenant-settings.settings.locale.localeWarning'];
            const buttonValue = this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.locale.changeSessionLocale' });
            warning = warning.replace('{label}', buttonValue);
            // eslint-disable-next-line no-alert
            window.alert(warning);
          });
        }
      });
  };

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <this.configManager
        label={this.props.label}
        moduleName="ORG"
        getInitialValues={this.getInitialValues}
        configName="localeSettings"
        onBeforeSave={this.beforeSave}
        onAfterSave={this.setLocaleSettings}
      >
        <IfPermission perm="ui-developer.settings.locale">
          <Row>
            <Col xs={12}>
              <p>
                <FormattedMessage
                  id="ui-tenant-settings.settings.locale.localeWarning"
                  values={{ label: formatMessage({ id: 'ui-tenant-settings.settings.locale.changeSessionLocale' }) }}
                />
              </p>
              <div>
                <Button to="/settings/developer/locale">
                  <FormattedMessage id="ui-tenant-settings.settings.locale.changeSessionLocale" />
                </Button>
              </div>
            </Col>
          </Row>
        </IfPermission>
        <Row>
          <Col xs={12} id="select-locale">
            <Field
              component={Select}
              id="locale"
              name="locale"
              placeholder="---"
              dataOptions={options}
              label={formatMessage({ id: 'ui-tenant-settings.settings.localization' })}
              onChange={this.handleLocaleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} id="select-timezone">
            <Field
              component={Select}
              id="timezone"
              name="timezone"
              placeholder="---"
              dataOptions={timeZonesList}
              label={formatMessage({ id: 'ui-tenant-settings.settings.timeZonePicker' })}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} id="select-currency">
            <Field
              component={CurrencySelect}
              id="currency"
              name="currency"
              placeholder="---"
              label={formatMessage({ id: 'ui-tenant-settings.settings.primaryCurrency' })}
            />
          </Col>
        </Row>
      </this.configManager>
    );
  }
}

export default injectIntl(Locale);
