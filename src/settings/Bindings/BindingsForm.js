import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Pane,
  PaneFooter,
  Row,
  TextArea,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { stripesShape, withStripes } from '@folio/stripes/core';

import styles from './Bindings.css';

function validate(values) {
  const errors = {};

  try {
    JSON.parse(values.bindings);
  } catch (error) {
    errors.bindings = error.message;
  }

  return errors;
}

class BindingsForm extends React.Component {
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
    const { handleSubmit, label, stripes } = this.props;
    const actionList = stripes.actionNames.map((name, index) => (
      <span key={name}>
       <>
         <tt>{name}</tt>
         {index < stripes.actionNames.length - 1 ? ', ' : '.'}
       </>
      </span>
    ));

    return (
      <form
        id="bindings-form"
        onSubmit={handleSubmit}
        className={styles.bindingsForm}
      >
        <Pane
          defaultWidth="fill"
          fluidContentWidth
          paneTitle={label}
          footer={this.getFooter()}
        >
          <Row>
            <Col xs={12}>
              <div>
                <FormattedMessage id="ui-tenant-settings.settings.keyBindings" />
              </div>
              <p>
                <FormattedMessage
                  id="ui-tenant-settings.settings.bindings.provide"
                  values={{
                    actionNames: <span>{actionList}</span>,
                  }}
                />
              </p>
              <p>
                <a href="https://github.com/folio-org/ui-tenant-settings/blob/master/src/settings/Bindings/example-key-bindings.json">[example]</a>
              </p>
              <br />
              <Field
                label={label}
                component={TextArea}
                name="bindings"
                id="bindings"
                fullWidth
                rows="12"
              />
            </Col>
          </Row>
        </Pane>
      </form>
    );
  }
}

BindingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  stripes: stripesShape.isRequired,
  submitting: PropTypes.bool,
  label: PropTypes.node,
};

export default stripesFinalForm({
  validate,
  navigationCheck: true,
})(withStripes(BindingsForm));
