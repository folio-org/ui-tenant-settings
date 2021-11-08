import React from 'react';

import { screen, render } from '@testing-library/react';

import '../../../../test/jest/__mocks__';
import buildStripes from '../../../../test/jest/__new_mocks__/stripesCore.mock';
import { renderWithRouter, renderWithReduxForm } from '../../../../test/jest/helpers';

import LocationFormContainer from './LocationFormContainer';
import { RemoteStorageApiProvider } from '../RemoteStorage/Provider';


jest.mock('./DetailsField', () => {
  return () => <span>DetaolsField</span>;
});

const onSaveMock = jest.fn();

const STRIPES = buildStripes();

const initialValuesMock = {
  campusId: '',
  detailsArray: [],
  institutionId: '',
  isActive: true,
  libraryId: '',
  servicePointIds:[
    {
      primary: true,
      selectSP: ''
    }
  ]
};
const servicePointsByNameMock = {
  CircDesk1: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
  CircDesk2: 'c4c90014-c8c9-4ade-8f24-b5e313319f4b',
  Online: '7c5abc9f-f3d7-4856-b8d7-6712462ca007',
};

const restPropsMock = {
  checkLocationHasHoldingsOrItems: jest.fn(() => Promise.resolve()),
  stripes: STRIPES,
  locationResources: {
    campuses: {
      records: [
        {
          code: 'CC',
          id: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
          institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
          name: 'City Campus',
        },
        {
          code: 'E',
          id: '470ff1dd-937a-4195-bf9e-06bcfcd135df',
          institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
          name: 'Online',
        }
      ]
    },
    entries: {
      records: [{
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU/CC/DI/A',
        id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        isActive: true,
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Annex',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f'],
        servicePoints: [],
      }
      ]
    },
    institutions: {
      records: [
        {
          code: 'KU',
          id: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
          metadata: { createdDate: '2021-11-08T03:24:13.021+00:00', updatedDate: '2021-11-08T03:24:13.021+00:00' },
          name: 'Københavns Universitet',
        }
      ]
    },
    libraries: {
      records: [
        {
          campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
          code: 'DI',
          id: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
          name: 'Datalogisk Institut',
        }
      ]
    },
    servicePoints: {
      records: [
        {
          code: 'cd1',
          discoveryDisplayName: 'Circulation Desk -- Hallway',
          holdShelfExpiryPeriod: { duration: 3, intervalId: 'Weeks' },
          id: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
          name: 'Circ Desk 1',
          pickupLocation: true,
          staffSlips: [],
        },
        {
          code: 'cd2',
          discoveryDisplayName: 'Circulation Desk -- Back Entrance',
          holdShelfExpiryPeriod: {
            duration: 5,
            intervalId: 'Days',
          },

          id: 'c4c90014-c8c9-4ade-8f24-b5e313319f4b',
          name: 'Circ Desk 2',
          pickupLocation: true,
          staffSlips: []
        }
      ]
    }
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

const renderLocationFormContainer = () => renderWithRouter(
  <LocationFormContainer
    onSave={onSaveMock}
    servicePointsByName={servicePointsByNameMock}
    initialValues={initialValuesMock}
    parentMutator={mutatorMock}
    {...restPropsMock}
  />
);

describe('LocationFormContainer', () => {
  it('should render ServicePointManager titles', async () => {
    renderLocationFormContainer();

    expect(renderLocationFormContainer).toBeDefined();
  });
});
