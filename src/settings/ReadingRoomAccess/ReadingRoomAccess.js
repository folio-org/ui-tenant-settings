import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Field } from 'redux-form';
import _ from 'lodash';

import { TitleManager, useStripes } from '@folio/stripes/core';
import {
  Checkbox,
  Label,
  MultiSelection,
} from '@folio/stripes/components';
import { ControlledVocab } from '@folio/stripes/smart-components';

const hiddenFields = ['numberOfObjects', 'lastUpdated'];
const visibleFields = ['name', 'isPublic', 'servicePoints'];
const formatter = {
  'isPublic': (record) => <Checkbox checked={record.isPublic} disabled />,
  'servicePoints': (record) => {
    const asp = record.servicePoints || [];
    const items = asp.map(a => <li key={a.label}>{a.label}</li>);
    return <ul className="marginBottom0">{items}</ul>;
  }
};
const translations = {
  cannotDeleteTermHeader: 'ui-tenant-settings.settings.addresses.cannotDeleteTermHeader',
  cannotDeleteTermMessage: 'ui-tenant-settings.settings.addresses.cannotDeleteTermMessage',
  deleteEntry: 'ui-tenant-settings.settings.reading-room-access.deleteEntry',
  termDeleted: 'ui-tenant-settings.settings.reading-room-access.termDeleted',
  termWillBeDeleted: 'ui-tenant-settings.settings.reading-room-access.termWillBeDeleted',
};

const ReadingRoomAccess = (props) => {
  const intl = useIntl();
  const stripes = useStripes();
  const { resources } = props;
  // service points defined in the tenant
  const servicePoints = _.get(resources, ['RRAServicePoints', 'records', 0, 'servicepoints'], []);
  /**
   * A reading room can have more than one service points assigned to it.
   * but a servicepoint cannot be mapped to more than one reading room
  */
  const sps = [];
  const rrs = _.get(resources, ['values', 'records']);
  rrs.forEach(rr => {
    const asp = rr.servicePoints || [];
    asp.forEach(s => {
      if (!sps.includes(s.value)) {
        sps.push(s.value);
      }
    });
  });

  const options = [];
  servicePoints.forEach(s => {
    if (!sps.includes(s.id) || s.name === 'None') {
      options.push({ value: s.id, label: s.name });
    }
  });

  const columnMapping = {
    name: (
      <Label tagName="span" required>
        {
        intl.formatMessage({ id:'ui-tenant-settings.settings.reading-room-access.name' })
      }
      </Label>),
    isPublic: intl.formatMessage({ id:'ui-tenant-settings.settings.reading-room-access.public' }),
    servicePoints: (
      <Label tagName="span" required>
        {
          intl.formatMessage({ id:'ui-tenant-settings.settings.reading-room-access.asp' })
        }
      </Label>),
  };

  const fieldComponents = {
    isPublic: ({ fieldProps }) => (
      <Field
        {...fieldProps}
        component={Checkbox}
        type="checkbox"
      />
    ),
    servicePoints: ({ fieldProps }) => {
      return (
        <Field
          {...fieldProps}
          id="rra-service-point"
          component={MultiSelection}
          aria-labelledby="associated-service-point-label"
          dataOptions={options}
          renderToOverlay
          marginBottom0
          validationEnabled
          onBlur={e => e.preventDefault()}
        />
      );
    }
  };

  const editable = true; // stripes.hasPerm('ui-users.settings.reading-room-access.all');

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room.title' })}>
      <ControlledVocab
        {...props}
        id="reading-room-access-settings"
        baseUrl="reading-room"
        stripes={stripes}
        label={intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room-access.label' })}
        objectLabel={intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room-access.label' })}
        records="readingRooms"
        visibleFields={visibleFields}
        columnMapping={columnMapping}
        hiddenFields={hiddenFields}
        formatter={formatter}
        translations={translations}
        editable={editable}
        fieldComponents={fieldComponents}
        actionSuppressor={{
          edit: () => true,
          delete: () => true,
        }}
      />
    </TitleManager>
  );
};

ReadingRoomAccess.manifest = Object.freeze({
  values: {
    type: 'okapi',
    records: 'readingRooms',
    path: 'reading-room',
    GET: {
      path: 'reading-room?query=cql.allRecords=1 sortby name&limit=100'
    }
  },
  updaterIds: [],
  RRAServicePoints: {
    type: 'okapi',
    resource: 'service-points',
    path: 'service-points?limit=200',
  },
});

ReadingRoomAccess.propTypes = {
  resources: PropTypes.object,
  mutator: PropTypes.object
};

export default ReadingRoomAccess;
