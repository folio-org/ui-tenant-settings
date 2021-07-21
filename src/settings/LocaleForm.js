import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  CurrencySelect,
  Pane,
  PaneFooter,
  Row,
  Select,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  IfPermission,
  supportedLocales,
  supportedNumberingSystems,
  stripesShape,
  withStripes,
} from '@folio/stripes/core';
import timezones from '../util/timezones';


import styles from './Locale.css';

const timezoneOptions = timezones.map(timezone => (
  {
    value: timezone.value,
    label: timezone.value,
  }
));

const localeOptions = supportedLocales.map(k => ({ value: k, label: k }));

const numberingSystemOptions = [
  { value: '', label: '---' },
  { value: 'arab', label: 'arab' },
  { value: 'latn', label: 'latn' },
];

class LocaleForm extends React.Component {
  getFooter() {
    const { pristine, submitting } = this.props;

    return (
      <PaneFooter
        renderEnd={(
          <Button
            type="submit"
            disabled={(pristine || submitting)}
            buttonStyle="primary"
          >
            <FormattedMessage id="stripes-core.button.save" />
          </Button>
        )}
      />
    );
  }

  render() {
    const { handleSubmit, label, stripes, intl: { formatMessage } } = this.props;

    return (
      <form
        id="locale-form"
        onSubmit={handleSubmit}
        className={styles.localeForm}
      >
        <Pane
          defaultWidth="fill"
          fluidContentWidth
          paneTitle={label}
          footer={this.getFooter()}
        >
          <IfPermission perm="ui-developer.settings.locale">
            <Row>
              <Col xs={12}>
                <p>
                  <FormattedMessage id="ui-tenant-settings.settings.locale.localeWarning" values={{ label: <FormattedMessage id="ui-tenant-settings.settings.locale.changeSessionLocale" /> }} />
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
                dataOptions={localeOptions}
                label={formatMessage({ id: 'ui-tenant-settings.settings.localization' })}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} id="select-numbering-system">
              <Field
                component={Select}
                id="numberingSystem"
                name="numberingSystem"
                dataOptions={numberingSystemOptions}
                label={formatMessage({ id: 'ui-tenant-settings.settings.numberingSystem' })}
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
                dataOptions={timezoneOptions}
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

        </Pane>
      </form>
    );
  }
}

LocaleForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  stripes: stripesShape.isRequired,
  submitting: PropTypes.bool,
  label: PropTypes.node,
  intl: PropTypes.object,
};

export default stripesFinalForm({
  navigationCheck: true,
})(withStripes(injectIntl(LocaleForm)));
