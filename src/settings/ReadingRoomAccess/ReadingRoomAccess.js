import React from 'react';
import { useIntl } from 'react-intl';

import { TitleManager, useStripes } from '@folio/stripes/core';
import {
  Label,
  Checkbox,
} from '@folio/stripes/components';
import { ControlledVocab } from '@folio/stripes/smart-components';

const readingRoomsData = {
  values: { records: [
    {
      'id': 1,
      'name': 'RR1',
      'public': true,
      'servicePoint': [
        {
          name: 'Circ Desk 1',
          id: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        },
        {
          id: 'c4c90014-c8c9-4ade-8f24-b5e313319f4b',
          name: 'Circ Desk 2'
        },
      ],
      // metadata: {
      //   'createdDate': '2024-03-21T10:59:25.085+00:00',
      //   'createdByUserId': 'af5ad81e-6857-5b65-9c0c-60942e56f872',
      //   'updatedDate': '2024-03-21T10:59:25.085+00:00',
      //   'updatedByUserId': 'af5ad81e-6857-5b65-9c0c-60942e56f872'
      // }
    },
    {
      'id': 2,
      'name': 'RR2',
      'public': true,
      'servicePoint': [{
        name: 'Circ Desk 1',
        id: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      }],
      // metadata: {
      //   'createdDate': '2024-03-21T10:59:25.085+00:00',
      //   'createdByUserId': 'af5ad81e-6857-5b65-9c0c-60942e56f872',
      //   'updatedDate': '2024-03-21T10:59:25.085+00:00',
      //   'updatedByUserId': 'af5ad81e-6857-5b65-9c0c-60942e56f872'
      // }
    },
  ] },
  updaters: {
    records: []
  },
  updaterIds: [],
};

const hiddenFields = ['numberOfObjects', 'lastUpdated'];
const visibleFields = ['name', 'public', 'servicePoint'];
const formatter = {
  'public': (record) => <Checkbox checked={record.public} disabled />,
  'servicePoint': (value) => {
    const asp = value.servicePoint || [];
    const items = asp.map(a => <li key={a.name}>{a.name}</li>);
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

  const columnMapping = {
    name: (
      <Label
        tagName="span"
        required
      >
        {
        intl.formatMessage({ id:'ui-tenant-settings.settings.reading-room-access.name' })
      }
      </Label>),
    public: intl.formatMessage({ id:'ui-tenant-settings.settings.reading-room-access.public' }),
    servicePoint: intl.formatMessage({ id:'ui-tenant-settings.settings.reading-room-access.asp' }),
  };

  const editable = false; // stripes.hasPerm('ui-users.settings.reading-room-access.all');

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room.title' })}>
      <ControlledVocab
        {...props}
        baseUrl="reading-room"
        stripes={stripes}
        label={intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room-access.label' })}
        objectLabel={intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room-access.label' })}
        resources={readingRoomsData}
        visibleFields={visibleFields}
        columnMapping={columnMapping}
        hiddenFields={hiddenFields}
        formatter={formatter}
        translations={translations}
        editable={editable}
      />
    </TitleManager>
  );
};

ReadingRoomAccess.manifest = Object.freeze({
  RRAServicePoints: {
    type: 'okapi',
    resource: 'service-points',
    path: 'service-points?limit=200',
  },
});

export default ReadingRoomAccess;
