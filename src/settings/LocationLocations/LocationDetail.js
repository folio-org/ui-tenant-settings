import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  get,
  isEmpty,
} from 'lodash';

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
  IfPermission,
  useStripes,
  TitleManager,
} from '@folio/stripes/core';

import LocationInUseModal from './LocationInUseModal';
import { useRemoteStorageApi } from './RemoteStorage';
import RemoteStorageDetails from './RemoteStorageDetails';
import { useCampusDetails } from '../../hooks/useCampusDetails';
import { useInstitutionDetails } from '../../hooks/useInstitutionDetails';
import { useLibraryDetails } from '../../hooks/useLibraryDetails';


const LocationDetail = ({
  initialValues: loc,
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
  const stripes = useStripes();
  const intl = useIntl();
  const hasAllLocationPerms = stripes.hasPerm('ui-tenant-settings.settings.location');
  const [isDeleteLocationModalOpened, setIsDeleteLocationModalOpened] = useState(false);
  const [isLocationInUseModalOpened, setIsLocationInUseModalOpened] = useState(false);

  const { campus } = useCampusDetails({ id: loc.campusId });
  const { institution } = useInstitutionDetails({ id: loc.institutionId });
  const { library } = useLibraryDetails({ id: loc.libraryId });
  const { setMapping } = useRemoteStorageApi();

  const handleExpandAll = (newSections) => {
    setSections(newSections);
  };

  const renderServicePoint = (sp, index) => {
    return (
      index === 0 ?
        <li key={index}>
          <>{sp} (primary)</>
        </li> :
        <li key={index}>
          {sp}
        </li>
    );
  };

  const renderServicePoints = () => {
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
  };

  const handleSectionToggle = ({ id }) => {
    setSections(prevSections => ({ ...prevSections, [id]: !prevSections[id] }));
  };

  const toggleDeleteLocationConfirmation = () => {
    setIsDeleteLocationModalOpened(prevState => !prevState);
  };

  const toggleLocationInUseModal = () => {
    setIsLocationInUseModalOpened(prevState => !prevState);
  };

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

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = item => ({ onToggle }) => {
    if (!hasAllLocationPerms) return null;

    return (
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
  };

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
    <FormattedMessage
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
      <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.items.title' }, { item: locationName })}>

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
          <RemoteStorageDetails locationId={loc.id} />
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
      </TitleManager>
    </Pane>
  );
};

LocationDetail.propTypes = {
  initialValues: PropTypes.object,
  institutions: PropTypes.arrayOf(PropTypes.object),
  campuses: PropTypes.arrayOf(PropTypes.object),
  libraries: PropTypes.arrayOf(PropTypes.object),
  servicePointsById: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onClone: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default LocationDetail;
