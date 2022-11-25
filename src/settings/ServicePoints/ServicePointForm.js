import React, { useCallback, useMemo, useState } from 'react';
import { orderBy } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Accordion,
  Button,
  Col,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  Select,
  TextArea,
  TextField,
  PaneFooter,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import stripesFinalForm from '@folio/stripes/final-form';
import { Field } from 'react-final-form';

import { useStripes } from '@folio/stripes/core';
import Period from '../../components/Period';
import LocationList from './LocationList';
import StaffSlipEditList from './StaffSlipEditList';
import { intervalPeriods } from '../../constants';

import {
  validateServicePointForm,
  getUniquenessValidation,
} from './utils';

import {
  shortTermExpiryPeriod,
  shortTermClosedDateManagementTranslations,
  longTermClosedDateManagementTranslations
} from './constants';

import styles from './ServicePoints.css';

const ServicePointForm = ({
  initialValues,
  parentResources,
  parentMutator,
  pristine,
  submitting,
  form,
  handleSubmit,
  onCancel
}) => {
  const [sections, setSections] = useState({
    generalSection: true,
    locationSection: true
  });
  const stripes = useStripes();
  const intl = useIntl();
  const CViewMetaData = useMemo(() => stripes.connect(ViewMetaData), []);

  const servicePoint = initialValues || {};
  const locations = servicePoint.id
    ? parentResources.locations?.records || []
    : [];
  const staffSlips = orderBy((parentResources.staffSlips || {}).records || [], 'name');
  const disabled = !stripes.hasPerm('settings.tenant-settings.enabled');
  const formValues = form.getState().values;
  console.log('form values ', formValues);
  const selectOptions = [
    {
      label: intl.formatMessage({ id: 'ui-tenant-settings.settings.servicePoints.pickupLocation.no' }),
      value: false
    },
    {
      label: intl.formatMessage({ id: 'ui-tenant-settings.settings.servicePoints.pickupLocation.yes' }),
      value: true
    }
  ];
  const periods = intervalPeriods.map(ip => (
    {
      ...ip,
      label: intl.formatMessage({ id: ip.label })
    }
  ));

  const renderFirstMenu = () => (
    <PaneMenu>
      <IconButton
        id="clickable-close-service-point"
        onClick={onCancel}
        icon="times"
        aria-label={<FormattedMessage id="stripes-core.button.cancel" />}
      />
    </PaneMenu>
  );

  const renderFooter = () => {
    const closeButton = (
      <Button
        id="clickable-footer-close-service-point"
        buttonStyle="default mega"
        onClick={onCancel}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        id="clickable-save-service-point"
        type="submit"
        buttonStyle="primary mega"
        disabled={(pristine || submitting)}
      >
        <FormattedMessage id="ui-tenant-settings.settings.general.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={closeButton}
        renderEnd={saveButton}
      />
    );
  };

  const renderPaneTitle = () => {
    if (servicePoint.id) {
      return (
        <div>
          <span>
            <FormattedMessage id="ui-tenant-settings.settings.servicePoints.edit" />
            {`: ${servicePoint.name}`}
          </span>
        </div>
      );
    }

    return <FormattedMessage id="ui-tenant-settings.settings.servicePoints.new" />;
  };


  const handleSectionToggle = useCallback(({ id }) => {
    setSections((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  }, []);

  const handleExpandAll = useCallback((newSections) => {
    setSections((prevState) => ({
      ...prevState,
      ...newSections
    }));
  }, []);

  const getClosedLibraryDateManagementOptions = () => {
    const { holdShelfExpiryPeriod = {} } = formValues;

    if (holdShelfExpiryPeriod?.intervalId) {
      if (shortTermExpiryPeriod.findIndex(item => item === holdShelfExpiryPeriod.intervalId) > -1) {
        return (shortTermClosedDateManagementTranslations.map(item => (
          {
            label: intl.formatMessage({ id: item.label }),
            value: item.value
          }
        )));
      } else {
        return (longTermClosedDateManagementTranslations.map(item => (
          {
            label: intl.formatMessage({ id: item.label }),
            value: item.value
          }
        )));
      }
    } else {
      return (longTermClosedDateManagementTranslations.map(item => (
        {
          label: intl.formatMessage({ id: item.label }),
          value: item.value
        }
      )));
    }
  };

  return (
    <form
      data-test-servicepoint-form
      id="form-service-point"
      onSubmit={handleSubmit}
      className={styles.servicePointsForm}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          firstMenu={renderFirstMenu()}
          footer={renderFooter()}
          paneTitle={renderPaneTitle()}
        >
          <Row end="xs">
            <Col xs>
              <ExpandAllButton accordionStatus={sections} onToggle={handleExpandAll} />
            </Col>
          </Row>
          <Accordion
            open={sections.generalSection}
            id="generalSection"
            onToggle={handleSectionToggle}
            label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.generalInformation" />}
          >
            {servicePoint.metadata && servicePoint.metadata.createdDate &&
            <Row>
              <Col xs={12}>
                <CViewMetaData metadata={servicePoint.metadata} />
              </Col>
            </Row>
            }
            <Row>
              <Col xs={4}>
                <Field
                  label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.name" />}
                  name="name"
                  id="input-service-point-name"
                  component={TextField}
                  autoFocus
                  required
                  fullWidth
                  disabled={disabled}
                  validate={getUniquenessValidation('name', parentMutator.uniquenessValidator)}
                  validateFields={[]}
                />
                <Field
                  label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.code" />}
                  name="code"
                  id="input-service-point-code"
                  component={TextField}
                  fullWidth
                  required
                  disabled={disabled}
                  validate={getUniquenessValidation('code', parentMutator.uniquenessValidator)}
                  validateFields={[]}
                />
                <Field
                  label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.discoveryDisplayName" />}
                  name="discoveryDisplayName"
                  id="input-service-point-discovery-name"
                  component={TextField}
                  fullWidth
                  required
                  disabled={disabled}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <Field
                  label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.description" />}
                  name="description"
                  id="input-service-description"
                  component={TextArea}
                  fullWidth
                  disabled={disabled}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <Field
                  label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.shelvingLagTime" />}
                  name="shelvingLagTime"
                  id="input-service-shelvingLagTime"
                  component={TextField}
                  fullWidth
                  disabled={disabled}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={2}>
                <Field
                  data-test-pickup-location
                  label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.pickupLocation" />}
                  name="pickupLocation"
                  id="input-service-pickupLocation"
                  component={Select}
                  dataOptions={selectOptions}
                  parse={v => (v === 'true')}
                  disabled={disabled}
                />
              </Col>
            </Row>
            {
              formValues.pickupLocation && (
                <>
                  <div data-test-holdshelfexpiry>
                    <Period
                      fieldLabel="ui-tenant-settings.settings.servicePoint.expirationPeriod"
                      selectPlaceholder="ui-tenant-settings.settings.servicePoint.selectInterval"
                      inputValuePath="holdShelfExpiryPeriod.duration"
                      selectValuePath="holdShelfExpiryPeriod.intervalId"
                      entity={formValues}
                      intervalPeriods={periods}
                      changeFormValue={form.mutators.changeFormValue}
                    />
                  </div>
                  <div data-test-closed-library-date-managemnet>
                    <Field
                      label={<FormattedMessage id="ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement" />}
                      name="holdShelfClosedLibraryDateManagement"
                      component={Select}
                      dataOptions={getClosedLibraryDateManagementOptions()}
                    />
                  </div>
                </>
              )
            }
            <StaffSlipEditList staffSlips={staffSlips} />
          </Accordion>
          <LocationList
            locations={locations}
            servicePoint={servicePoint}
            expanded={sections.locationSection}
            onToggle={handleSectionToggle}
          />
        </Pane>
      </Paneset>
    </form>
  );
};

ServicePointForm.propTypes = {
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  parentResources: PropTypes.object,
  parentMutator: PropTypes.object,
  onCancel: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  form: PropTypes.object.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  validate: validateServicePointForm,
  subscription: {
    values: true,
  },
  mutators: {
    changeFormValue: (args, state, utils) => {
      utils.changeValue(state, args[0], () => args[1]);
    },
  },
  validateOnBlur: true,
})(ServicePointForm);
