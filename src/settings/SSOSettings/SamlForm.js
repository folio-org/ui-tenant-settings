import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Pane,
  Row,
  Select,
  TextField,
  PaneFooter,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { IfPermission } from '@folio/stripes/core';

import styles from './SSOSettings.css';
import { useSamlDownload } from '../../hooks/useSamlDownload';


const validate = (values) => {
  const errors = {};

  if (!values.samlBinding) {
    errors.samlBinding = <FormattedMessage id="ui-tenant-settings.settings.saml.validate.binding" />;
  }
  if (!values.samlAttribute) {
    errors.samlAttribute = <FormattedMessage id="ui-tenant-settings.settings.saml.validate.fillIn" />;
  }
  if (!values.userProperty) {
    errors.userProperty = <FormattedMessage id="ui-tenant-settings.settings.saml.validate.userProperty" />;
  }
  return errors;
};


const SamlForm = ({
  validateIdpUrl,
  handleSubmit,
  pristine,
  submitting,
  initialValues,
  optionLists,
  label,
  values,
  readOnly,
}) => {
  const { downloadFile } = useSamlDownload({
    onSuccess: (result) => {
      const anchor = document.createElement('a');
      anchor.href = `data:text/plain;base64,${result?.fileContent}`;
      anchor.download = 'sp-metadata.xml';
      anchor.click();

      initialValues.metadataInvalidated = false;
    },
  });

  const identifierOptions = (optionLists.identifierOptions || []).map(i => (
    { id: i.key, label: i.label, value: i.key, selected: initialValues.userProperty === i.key }
  ));

  const samlBindingOptions = optionLists.samlBindingOptions.map(i => (
    { id: i.key, label: i.label, value: i.key, selected: initialValues.samlBinding === i.key }
  ));

  const footer = !readOnly && (
    <PaneFooter
      renderEnd={(
        <Button
          type="submit"
          buttonStyle="primary"
          disabled={(pristine || submitting)}
        >
          <FormattedMessage id="stripes-core.button.save" />
        </Button>
      )}
    />
  );

  return (
    <form
      id="form-saml"
      onSubmit={handleSubmit}
      className={styles.samlForm}
    >
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={label}
        footer={footer}
      >
        <Row>
          <Col xs={12} id="fill_idpUrl">
            <Field
              disabled={readOnly}
              label={<FormattedMessage id="ui-tenant-settings.settings.saml.idpUrl" />}
              name="idpUrl"
              id="samlconfig_idpUrl"
              component={TextField}
              required
              fullWidth
              validate={validateIdpUrl}
            />
            <div hidden={!initialValues.metadataInvalidated}>
              <FormattedMessage id="ui-tenant-settings.settings.saml.idpUrlChanged" />
            </div>
            <IfPermission perm="login-saml.all">
              <Button
                id="download-metadata-button"
                onClick={downloadFile}
                disabled={!values.idpUrl || !pristine}
              >
                <FormattedMessage id="ui-tenant-settings.settings.saml.downloadMetadata" />
              </Button>
            </IfPermission>
          </Col>
        </Row>
        <Row>
          <Col id="select_samlBinding">
            <Field
              disabled={readOnly}
              label={<FormattedMessage id="ui-tenant-settings.settings.saml.binding" />}
              name="samlBinding"
              id="samlconfig_samlBinding"
              placeholder="---"
              component={Select}
              dataOptions={samlBindingOptions}
              fullWidth
              required
            />
          </Col>
        </Row>
        <Row>
          <Col id="fill_attribute">
            <Field
              disabled={readOnly}
              label={<FormattedMessage id="ui-tenant-settings.settings.saml.attribute" />}
              name="samlAttribute"
              id="samlconfig_samlAttribute"
              component={TextField}
              required={!readOnly}
              fullWidth
            />
          </Col>
        </Row>
        <Row>
          <Col id="select_userProperty">
            <Field
              disabled={readOnly}
              label={<FormattedMessage id="ui-tenant-settings.settings.saml.userProperty" />}
              name="userProperty"
              id="samlconfig_userProperty"
              placeholder="---"
              component={Select}
              dataOptions={identifierOptions}
              fullWidth
              required
            />
          </Col>
        </Row>
      </Pane>
    </form>
  );
};

SamlForm.propTypes = {
  validateIdpUrl: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  initialValues: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
  values: PropTypes.object,
  optionLists: PropTypes.shape({
    identifierOptions: PropTypes.arrayOf(PropTypes.object),
    samlBindingOptions: PropTypes.arrayOf(PropTypes.object),
  }),
  label: PropTypes.node,
  readOnly: PropTypes.bool,
};

export default stripesFinalForm({
  validate,
  subscription: { values: true },
  navigationCheck: true,
})(SamlForm);
