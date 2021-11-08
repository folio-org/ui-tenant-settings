import React from 'react';

import { createMemoryHistory } from 'history';

import '../../../test/jest/__mocks__';
import buildStripes from '../../../test/jest/__new_mocks__/stripesCore.mock';
import {
  renderWithRouter
} from '../../../test/jest/helpers';

import LocationManager from './LocationManager';

jest.mock('react-virtualized-auto-sizer', () => {
  return jest.fn(({ children }) => <div>{children({})}</div>);
});

const STRIPES = buildStripes();

const history = createMemoryHistory();

const locationMock = {
  pathname: 'setting/tenant-settings/location-locations',
  search: ''
};

const resourcesMock = {
  campuses: { hasLoaded: true,
    records:[{ code: 'CC',
      id: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
      institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
      name: 'City Campus' },
    {
      code: 'E',
      id: '470ff1dd-937a-4195-bf9e-06bcfcd135df',
      institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
      name: 'Online'
    }
    ] },
  entries:{
    hasLoaded: true,
    records:[
      {
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU/CC/DI/A',
        id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        isActive: true,
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Annex',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f'],
        servicePoints: []
      }
    ]
  },
  institutions:{
    hasLoaded: true,
    records: [
      {
        code: 'KU',
        id: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        name: 'Københavns Universitet',
      }
    ]
  },
  libraries:{
    records: [
      {
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'DI',
        id: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Datalogisk Institut'
      }
    ]
  },
  servicePoints: {
    hasLoaded: true,
    records: [{
      code: 'cd1',
      discoveryDisplayName: 'Circulation Desk -- Hallway',
      holdShelfExpiryPeriod: { duration: 3, intervalId: 'Weeks' },
      id: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
      name: 'Circ Desk 1',
      pickupLocation: true,
      staffSlips: [],
    },
    {
      code: 'Online',
      discoveryDisplayName: 'Online',
      id: '7c5abc9f-f3d7-4856-b8d7-6712462ca007',
      metadata: { createdDate: '2021-11-04T03:24:42.555+00:00', updatedDate: '2021-11-04T03:24:42.555+00:00' },
      name: 'Online',
      pickupLocation: false,
      shelvingLagTime: 0,
      staffSlips: [],
    }
    ]
  }
};

const mutatorMock = {
  servicePoints: {
    POST: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    DELETE: jest.fn(() => Promise.resolve()),
  },
  institutions: {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
  },
  campuses: {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
  },
  libraries: {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
  },
  holdingsEntries: {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
  },
  itemEntries: {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
  },
  entries: {
    DELETE: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
  },
  uniquenessValidator: {
    DELETE: jest.fn(() => Promise.resolve()),
    GET: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    cancel: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
  }
};

const matchMock = {
  path: 'setting/tenant-settings/location-locations'
};

const renderLocationManager = () => renderWithRouter(<LocationManager
  stripes={STRIPES}
  resources={resourcesMock}
  mutator={mutatorMock}
  label={<span>ServicePointManager</span>}
  location={locationMock}
  history={history}
  match={matchMock}
/>);

describe('LocationManager', () => {
  beforeEach(() => {
    history.push('setting/tenant-settings/location-locations');
  });
  it('should render LocationManager', async () => {
    renderLocationManager();

    expect(renderLocationManager).toBeDefined();
  });
});
