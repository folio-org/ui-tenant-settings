import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, sortBy } from 'lodash';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  TitleManager,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
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

import { validate, getUniquenessValidation } from '../utils';
import FilteredSelect from './FilteredSelect';
import ServicePointsFields from './ServicePointsFields';
import DetailsField from './DetailsField';
import { RemoteStorageField } from './RemoteStorageField';


const LocationForm = ({
  handleSubmit,
  initialValues,
  form,
  onCancel,
  pristine,
  submitting,
  cloning,
  institutions,
  campuses,
  libraries,
  servicePoints,
  checkLocationHasHoldingsOrItems,
}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const { formatMessage } = useIntl();

  const [sections, setSections] = useState({
    generalSection: true,
    detailsSection: true,
  });

  const mappedInstitutions = institutions.map(i => ({ value: i.id, label: `${i.name} ${i.code ? `(${i.code})` : ''}` }));
  const mappedServicePoints = sortBy(servicePoints, ['name']).map(i => ({ label: `${i.name}` }));

  const handleExpandAll = (newSections) => {
    setSections(newSections);
  };

  const handleSectionToggle = ({ id }) => {
    setSections((curState) => {
      const newState = cloneDeep(curState);
      newState[id] = !newState[id];
      return newState;
    });
  };

  const addFirstMenu = () => (
    <PaneMenu>
      <FormattedMessage id="stripes-core.button.cancel">
        {ariaLabel => (
          <IconButton
            id="clickable-close-locations-location"
            onClick={onCancel}
            icon="times"
            aria-label={ariaLabel}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );

  const renderFooter = () => {
    const closeButton = (
      <Button
        id="clickable-footer-close-locations-location"
        buttonStyle="default mega"
        onClick={onCancel}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        id="clickable-save-location"
        type="submit"
        buttonStyle="primary mega"
        marginBottom0
        disabled={((pristine || submitting) && !cloning)}
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderEnd={saveButton}
        renderStart={closeButton}
      />
    );
  };

  const renderPaneTitle = () => {
    const loc = initialValues || {};

    if (loc.id) {
      return (
        <span>
          <FormattedMessage id="stripes-core.button.edit" />
          {`: ${loc.name}`}
        </span>
      );
    }

    return <FormattedMessage id="ui-tenant-settings.settings.location.locations.new" />;
  };

  const formValues = form.getState().values;

  const titleManagerLabel = initialValues?.name && initialValues?.id
    ? formatMessage({ id:'ui-tenant-settings.settings.items.edit.title' }, { item: initialValues?.name })
    : formatMessage({ id:'ui-tenant-settings.settings.location.createNew.title' });

  return (
    <TitleManager page={titleManagerLabel}>
      <form
        id="form-locations"
        onSubmit={handleSubmit}
        noValidate
      >
        <Paneset isRoot>
          <Pane
            id="location-form-pane"
            defaultWidth="100%"
            firstMenu={addFirstMenu()}
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
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.generalInformation" />}
            >
              {initialValues?.metadata?.createdDate &&
                <Row>
                  <Col xs={12}>
                    <ViewMetaData metadata={initialValues.metadata} />
                  </Col>
                </Row>
              }
              <Row>
                <Col xs={12}>
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
                    name="institutionId"
                    id="input-location-institution"
                    component={Select}
                    required
                    disabled={!stripes.hasPerm('settings.tenant-settings.enabled')}
                    dataOptions={[
                      { label: formatMessage({ id: 'ui-tenant-settings.settings.location.institutions.selectInstitution' }) },
                      ...mappedInstitutions
                    ]}
                    onChange={form.mutators.changeInstitution}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FilteredSelect
                    list={campuses}
                    institutionId={formValues.institutionId}
                    filterFieldId="institutionId"
                    formatter={(i) => `${i.name}${i.code ? ` (${i.code})` : ''}`}
                    initialOption={{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.campuses.selectCampus' }) }}
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
                    name="campusId"
                    id="input-location-campus"
                    component={Select}
                    required
                    disabled={!stripes.hasPerm('settings.tenant-settings.enabled')}
                    onChange={form.mutators.changeCampus}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FilteredSelect
                    list={libraries}
                    campusId={formValues.campusId}
                    filterFieldId="campusId"
                    formatter={(i) => `${i.name}${i.code ? ` (${i.code})` : ''}`}
                    initialOption={{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.libraries.selectLibrary' }) }}
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />}
                    name="libraryId"
                    id="input-location-library"
                    component={Select}
                    required
                    disabled={!stripes.hasPerm('settings.tenant-settings.enabled')}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8} data-test-location-name>
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.name" />}
                    name="name"
                    id="input-location-name"
                    component={TextField}
                    required
                    fullWidth
                    disabled={!stripes.hasPerm('settings.tenant-settings.enabled')}
                    validate={getUniquenessValidation('name', ky, initialValues?.id)}
                    validateFields={[]}
                  />
                </Col>
                <Col xs={4}>
                  <RemoteStorageField
                    initialValues={initialValues}
                    checkLocationHasHoldingsOrItems={checkLocationHasHoldingsOrItems}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.code" />}
                    name="code"
                    id="input-location-code"
                    component={TextField}
                    required
                    fullWidth
                    disabled={!stripes.hasPerm('settings.tenant-settings.enabled')}
                    validate={getUniquenessValidation('code', ky, initialValues?.id)}
                    validateFields={[]}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.discoveryDisplayName" />}
                    name="discoveryDisplayName"
                    id="input-location-discovery-display-name"
                    component={TextField}
                    required
                    fullWidth
                    disabled={!stripes.hasPerm('settings.tenant-settings.enabled')}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <ServicePointsFields
                    servicePoints={mappedServicePoints}
                    formValues={formValues}
                    changePrimary={form.mutators.changeServicePointPrimary}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.status" />}
                    name="isActive"
                    id="input-location-status"
                    component={Select}
                    disabled={!stripes.hasPerm('settings.tenant-settings.enabled')}
                    format={String}
                  >
                    <FormattedMessage id="ui-tenant-settings.settings.location.locations.active">
                      { label => (
                        <option value="true">{label}</option>
                      )}
                    </FormattedMessage>
                    <FormattedMessage id="ui-tenant-settings.settings.location.locations.inactive">
                      { label => (
                        <option value="false">{label}</option>
                      )}
                    </FormattedMessage>
                  </Field>
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.description" />}
                    name="description"
                    id="input-location-description"
                    component={TextArea}
                    fullWidth
                    disabled={!stripes.hasPerm('settings.tenant-settings.enabled')}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={sections.detailsSection}
              id="detailsSection"
              onToggle={handleSectionToggle}
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.locationDetails" />}
            >
              <DetailsField />
            </Accordion>
          </Pane>
        </Paneset>
      </form>
    </TitleManager>
  );
};

LocationForm.propTypes = {
  institutions: PropTypes.arrayOf(PropTypes.object),
  campuses: PropTypes.arrayOf(PropTypes.object),
  libraries: PropTypes.arrayOf(PropTypes.object),
  servicePoints: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  cloning: PropTypes.bool,
  form: PropTypes.object.isRequired,
  checkLocationHasHoldingsOrItems: PropTypes.func
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    values: true,
  },
  mutators: {
    changeInstitution: (args, state, utils) => {
      utils.changeValue(state, 'institutionId', () => args[0].target.value);
      utils.changeValue(state, 'campusId', () => null);
      utils.changeValue(state, 'libraryId', () => null);
    },
    changeCampus: (args, state, utils) => {
      utils.changeValue(state, 'campusId', () => args[0].target.value);
      utils.changeValue(state, 'libraryId', () => null);
    },
    changeServicePointPrimary: (args, state, utils) => {
      utils.changeValue(state, `servicePointIds[${args[0]}].primary`, () => args[1]);
    },
  },
  validate,
  validateOnBlur: true,
})(LocationForm);
