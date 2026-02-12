import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  createIntl,
  createIntlCache,
  FormattedMessage, useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  CurrencySelect,
  Pane,
  PaneFooter,
  Row,
  Select,
  TextLink,
  timezones,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  IfPermission,
  supportedLocales,
  supportedNumberingSystems,
  useStripes,
} from '@folio/stripes/core';

import styles from './Locale.css';


const timezoneOptions = timezones.map(timezone => ({
  value: timezone.value,
  label: timezone.value,
}));

const localesList = (intl) => {
  const cache = createIntlCache();

  const locales = supportedLocales.map(l => {
    const lIntl = createIntl({
      locale: l,
      messages: {},
    },
    cache);

    return {
      value: l,
      label: `${intl.formatDisplayName(l, { type: 'language' })} / ${lIntl.formatDisplayName(l, { type: 'language' })}`,
    };
  });

  return locales.sort((a, b) => a.label.localeCompare(b.label));
};

const numberingSystemsList = () => {
  const cache = createIntlCache();

  return supportedNumberingSystems.map(f => {
    const lIntl = createIntl({
      locale: `en-u-nu-${f}`,
      messages: {},
    },
    cache);

    return {
      value: f,
      label: `${f} (${Array.from(Array(10).keys()).map(i => lIntl.formatNumber(i)).join(' ')})`,
    };
  });
};

const LocaleForm = ({ handleSubmit, pristine, submitting, label }) => {
  const intl = useIntl();
  const stripes = useStripes();

  const isReadOnly = !stripes.hasPerm('ui-tenant-settings.settings.locale');
  const localesOptions = useMemo(() => localesList(intl), [intl]);
  const numberingSystemOptions = useMemo(() => [
    { value: '', label: '---' },
    ...numberingSystemsList(),
  ], []);

  const getFooter = () => (
    !isReadOnly && (
      <PaneFooter
        renderEnd={(
          <Button
            type="submit"
            disabled={pristine || submitting}
            buttonStyle="primary"
          >
            <FormattedMessage id="stripes-core.button.save" />
          </Button>
        )}
      />
    )
  );

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
        footer={getFooter()}
      >
        <IfPermission perm="ui-developer.settings.locale">
          <Row>
            <Col xs={12}>
              <p>
                <FormattedMessage id="ui-tenant-settings.settings.locale.localeWarning" values={{ label: <FormattedMessage id="ui-tenant-settings.settings.locale.changeSessionLocale" /> }} />
              </p>
              <div>
                <TextLink to="/settings/developer/locale">
                  <FormattedMessage id="ui-tenant-settings.settings.locale.changeSessionLocale" />
                </TextLink>
              </div>
            </Col>
          </Row>
        </IfPermission>
        <Row>
          <Col xs={12} id="select-locale">
            <Field
              readOnly={isReadOnly}
              component={Select}
              id="locale"
              name="locale"
              placeholder="---"
              dataOptions={localesOptions}
              label={intl.formatMessage({ id: 'ui-tenant-settings.settings.localization' })}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} id="select-numbering-system">
            <Field
              readOnly={isReadOnly}
              component={Select}
              id="numberingSystem"
              name="numberingSystem"
              dataOptions={numberingSystemOptions}
              label={intl.formatMessage({ id: 'ui-tenant-settings.settings.numberingSystem' })}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} id="select-timezone">
            <Field
              readOnly={isReadOnly}
              component={Select}
              id="timezone"
              name="timezone"
              placeholder="---"
              dataOptions={timezoneOptions}
              label={intl.formatMessage({ id: 'ui-tenant-settings.settings.timeZonePicker' })}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} id="select-currency">
            <Field
              readOnly={isReadOnly}
              component={CurrencySelect}
              id="currency"
              name="currency"
              placeholder="---"
              label={intl.formatMessage({ id: 'ui-tenant-settings.settings.primaryCurrency' })}
            />
          </Col>
        </Row>
      </Pane>
    </form>
  );
};

LocaleForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  label: PropTypes.node,
};

export default stripesFinalForm({
  navigationCheck: true,
})(LocaleForm);
