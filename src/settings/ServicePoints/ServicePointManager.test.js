import React from 'react';

import '../../../test/jest/__mocks__';
import buildStripes from '../../../test/jest/__new_mocks__/stripesCore.mock';
import { renderWithRouter } from '../../../test/jest/helpers';

import ServicePointManager from './ServicePointManager';

const STRIPES = buildStripes();

const mutatorMock = {
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

const resourcesMock = {
  entries: {
    dataKey: 'servicePoints',
    module: '@folio/tenant-settings',
    httpStatus: 200,
    other: {
      totalRecords: 2
    },
    hasLoaded: true,
    isPending: false,
    records: [
      {
        code: 'cd1',
        id: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        name: 'Circ Desk 1',
        discoveryDisplayName: 'Circulation Desk -- Hallway',
        pickupLocation: true
      },
      {
        code: 'Online',
        id: '7c5abc9f-f3d7-4856-b8d7-6712462ca007',
        name: 'Online',
        discoveryDisplayName: 'Online',
        pickupLocation: false,
        shelvingLagTime: 0,
      }
    ]
  },
  staffSlips: {
    dataKey: 'servicePoints',
    module: '@folio/tenant-settings',
    other: {
      totalRecords: 4
    },
    resource: 'staffSlips',
    records: [
      {
        active: true,
        name: 'Hold',
        id: '6a6e72f0-69da-4b4c-8254-7154679e9d88',
        template: '<p></p>',
        metadata: {
          createdDate: '2021-10-28T03:23:25.934+00:00',
          updatedDate: '2021-10-28T03:23:25.934+00:00'
        }
      },
      {
        active: true,
        name: 'Pick slip',
        id: '8812bae1-2738-442c-bc20-fe4bb38a11f8',
        template: '<p></p>',
        metadata: {
          createdDate: '2021-10-28T03:23:25.917+00:00',
          updatedDate: '2021-10-28T03:23:25.917+00:00'
        }
      },
      {
        active: true,
        name: 'Request delivery',
        id: '1ed55c5c-64d9-40eb-8b80-7438a262288b',
        template: '<p></p>'
      },
      {
        active: true,
        name: 'Transit',
        id: 'f838cdaf-555a-473f-abf1-f35ef6ab8ae1',
        template: '<p></p>'
      },
    ]
  },
};

const renderServicePointManager = () => renderWithRouter(<ServicePointManager
  stripes={STRIPES}
  resources={resourcesMock}
  mutator={mutatorMock}
  label={<span>ServicePointManager</span>}
/>);

describe('ServicePointManager', () => {
  it('should render ServicePointManager titles', async () => {
    renderServicePointManager();

    expect(renderServicePointManager).toBeDefined();
  });
});
