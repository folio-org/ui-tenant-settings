import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Col, List, Row } from '@folio/stripes/components';
import {
  FormattedMessage, useIntl,
} from 'react-intl';

function LocationList({ locations, expanded, servicePoint, onToggle }) {
  const intl = useIntl();

  const renderLocation = (location) => {
    if (!location) return (<div />);

    const { name, code, primaryServicePoint } = location;
    const primary = (primaryServicePoint === servicePoint.id)
      ? intl.formatMessage({ id: 'ui-tenant-settings.settings.servicePoints.primary' }) :
      '';
    const title = `${name} - ${code} ${primary}`;
    return (<li key={title}>{title}</li>);
  };

  const renderLocations = () => {
    return (
      <List
        items={locations}
        itemFormatter={location => renderLocation(location)}
        isEmptyMessage={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.noLocationsFound" />}
      />
    );
  };

  return (
    <Accordion
      open={expanded}
      id="locationSection"
      onToggle={onToggle}
      label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.assignedLocations" />}
    >
      <Row>
        <Col xs={12}>
          {renderLocations(locations)}
        </Col>
      </Row>
    </Accordion>
  );
}

LocationList.propTypes = {
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  locations: PropTypes.arrayOf(PropTypes.object),
  servicePoint: PropTypes.object,
};

export default memo(LocationList);
