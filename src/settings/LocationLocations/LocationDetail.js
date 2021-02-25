import React, { useState, useMemo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  get,
  isEmpty,
} from 'lodash';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import {
  Accordion,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  KeyValue,
  Row,
  List,
  Pane,
  Button,
  Icon,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  stripesConnect,
  IfPermission,
} from '@folio/stripes/core';

import LocationInUseModal from './LocationInUseModal';
import { useRemoteStorageApi } from './RemoteStorage';

const LocationDetail = ({
  initialValues: loc,
  resources: {
    institutions,
    campuses,
    libraries,
  },
  servicePointsById,
  onEdit,
  onClone,
  onClose,
  onRemove,
}) => {
  const [sections, setSections] = useState({
    generalInformation: true,
    locationDetails: true,
  });
  const [isDeleteLocationModalOpened, setIsDeleteLocationModalOpened] = useState(false);
  const [isLocationInUseModalOpened, setIsLocationInUseModalOpened] = useState(false);

  const { remoteMap, configurations, setMapping } = useRemoteStorageApi();

  const remoteStorageName = useMemo(() => {
    const currentConfig = configurations?.records.find(config => remoteMap[loc.id] === config.id);
    return currentConfig?.name;
  }, [loc]);

  const handleExpandAll = setSections;

  const renderServicePoint = useCallback((sp, index) => {
    return (
      index === 0 ?
        <li key={index}>
          <>{sp} (primary)</>
        </li> :
        <li key={index}>
          {sp}
        </li>
    );
  }, []);

  const renderServicePoints = useCallback(() => {
    const itemsList = [];
    // as primary servicePoint surely exists and servicePointsById shouldn't be empty, its index would be at the 0th position of itemsList array
    if (!isEmpty(servicePointsById) && loc.servicePointIds.length !== 0) {
      itemsList.push(servicePointsById[loc.primaryServicePoint]);
      loc.servicePointIds.forEach((item) => {
        // exclude the primary servicepoint from being added again into the array
        if (!itemsList.includes(item.selectSP)) itemsList.push(item.selectSP);
      });
    }

    return (
      <List
        items={itemsList}
        itemFormatter={renderServicePoint}
        isEmptyMessage="No servicePoints found"
      />
    );
  }, []);

  const handleSectionToggle = useCallback(({ id }) => {
    setSections(prevSections => ({ ...prevSections, [id]: !prevSections[id] }));
  }, []);

  const toggleDeleteLocationConfirmation = useCallback(() => {
    setIsDeleteLocationModalOpened(prevState => !prevState);
  }, []);

  const toggleLocationInUseModal = useCallback(() => {
    setIsLocationInUseModalOpened(prevState => !prevState);
  }, []);

  const removeLocation = () => {
    toggleDeleteLocationConfirmation();

    onRemove(loc)
      .then(isRemoved => {
        if (!isRemoved) {
          toggleLocationInUseModal();
        } else {
          setMapping({ folioLocationId: loc.id });
        }
      });
  };

  const renderActionMenu = item => ({ onToggle }) => (
    <>
      <Button
        data-test-edit-location-menu-button
        buttonStyle="dropdownItem"
        id="clickable-edit-location"
        onClick={() => {
          onEdit(item);
          onToggle();
        }}
      >
        <Icon icon="edit">
          <FormattedMessage id="stripes-components.button.edit" />
        </Icon>
      </Button>
      <Button
        data-test-clone-location-menu-button
        buttonStyle="dropdownItem"
        id="clickable-copy-location"
        onClick={() => {
          onClone(item);
          onToggle();
        }}
      >
        <Icon icon="duplicate">
          <FormattedMessage id="stripes-components.button.duplicate" />
        </Icon>
      </Button>
      <IfPermission perm="settings.tenant-settings.enabled">
        <Button
          data-test-delete-location-menu-button
          buttonStyle="dropdownItem"
          id="clickable-delete-location"
          onClick={() => {
            toggleDeleteLocationConfirmation();
            onToggle();
          }}
        >
          <Icon icon="trash">
            <FormattedMessage id="stripes-core.button.delete" />
          </Icon>
        </Button>
      </IfPermission>
    </>
  );

  const institutionList = institutions?.records || [];
  const institution = institutionList.length === 1 ? institutionList[0] : null;

  const campusList = campuses?.records || [];
  const campus = campusList.length === 1 ? campusList[0] : null;

  const libraryList = libraries?.records || [];
  const library = libraryList.length === 1 ? libraryList[0] : null;

  // massage the "details" property which is represented in the API as
  // an object but displayed on the details page as an array of
  // key-value pairs sorted by key.
  const details = [];
  Object.keys(loc.details || []).sort().forEach(name => {
    details.push(
      <Row key={name}>
        <Col xs={12}>
          <KeyValue label={name} value={loc.details[name]} />
        </Col>
      </Row>
    );
  });

  const locationName =
    loc.name || <FormattedMessage id="ui-tenant-settings.settings.location.locations.untitledLocation" />;
  const confirmationMessage = (
    <SafeHTMLMessage
      id="ui-tenant-settings.settings.location.locations.deleteLocationMessage"
      values={{ name: locationName }}
    />
  );

  return (
    <Pane
      id="location-details"
      paneTitle={loc.name}
      defaultWidth="70%"
      dismissible
      actionMenu={renderActionMenu(loc)}
      onClose={onClose}
    >
      <Row end="xs">
        <Col xs>
          <ExpandAllButton accordionStatus={sections} onToggle={handleExpandAll} />
        </Col>
      </Row>
      <Accordion
        open={sections.generalInformation}
        id="generalInformation"
        onToggle={handleSectionToggle}
        label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.generalInformation" />}
      >
        {loc.metadata && loc.metadata.createdDate &&
          <Row>
            <Col xs={12}>
              <ViewMetaData metadata={loc.metadata} />
            </Col>
          </Row>
        }
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
              value={get(institution, ['name'])}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
              value={get(campus, ['name'])}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />}
              value={get(library, ['name'])}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.name" />}
              value={loc.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.code" />}
              value={loc.code}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.discoveryDisplayName" />}
              value={loc.discoveryDisplayName}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.servicePoints" />}
            >
              {renderServicePoints()}
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.status" />}
              value={<FormattedMessage id={`ui-tenant-settings.settings.location.${loc.isActive ? 'locations.active' : 'locations.inactive'}`} />}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.description" />}
              value={loc.description}
            />
          </Col>
        </Row>
        {remoteStorageName && (
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.remoteStorage" />}
                value={remoteStorageName}
              />
            </Col>
          </Row>
        )}
      </Accordion>
      <Accordion
        open={sections.locationDetails}
        id="locationDetails"
        onToggle={handleSectionToggle}
        label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.locationDetails" />}
      >
        {details}
      </Accordion>

      {
        isDeleteLocationModalOpened && (
          <ConfirmationModal
            id="deletelocation-confirmation"
            open
            heading={<FormattedMessage id="ui-tenant-settings.settings.location.locations.deleteLocation" />}
            message={confirmationMessage}
            onConfirm={removeLocation}
            onCancel={toggleDeleteLocationConfirmation}
            confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
          />
        )
      }

      {
        isLocationInUseModalOpened && (
          <LocationInUseModal toggleModal={toggleLocationInUseModal} />
        )
      }
    </Pane>
  );
};

LocationDetail.manifest = Object.freeze({
  institutions: {
    type: 'okapi',
    path: 'location-units/institutions/!{initialValues.institutionId}',
  },
  campuses: {
    type: 'okapi',
    path: 'location-units/campuses/!{initialValues.campusId}',
  },
  libraries: {
    type: 'okapi',
    path: 'location-units/libraries/!{initialValues.libraryId}',
  },
});

LocationDetail.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }).isRequired,
  initialValues: PropTypes.object,
  resources: PropTypes.shape({
    institutions: PropTypes.object,
    campuses: PropTypes.object,
    libraries: PropTypes.object,
    mappings: PropTypes.array,
  }).isRequired,
  servicePointsById: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onClone: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default stripesConnect(LocationDetail);
