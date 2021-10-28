import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import buildStripes from '../../../test/jest/__new_mocks__/stripesCore.mock';
import {
  renderWithRouter, renderWithReduxForm
} from '../../../test/jest/helpers';

import ServicePointFormContainer from './ServicePointFormContainer';

const STRIPES = buildStripes();

const onSaveMock = jest.fn();

const initialValuesMock = {};

const parentMutatorMock = {
  staffSlips: {
    DELETE: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
    PUT: jest.fn(() => Promise.resolve()),
    cancel: jest.fn(() => Promise.resolve()),
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

const parentResourcesMock = {
  entries: {
    dataKey: 'servicePoints',
    module: '@folio/tenant-settings',
    httpStatus: 200,
    other: {
      totalRecords: 3
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
  locations: {
    failed: false,
    hasLoaded: false,
    isPending: false,
    records: [
      {
        campusId:'62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU/CC/DI/A',
        id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        isActive: true,
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        metadata: {
          createdDate: '2021-10-28T03:23:16.749+00:00',
          updatedDate: '2021-10-28T03:23:16.749+00:00',
        },
        name: 'Annex',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f'],
        servicePoints: []
      },
      {
        campusId:'62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU/CC/DI/M',
        id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        isActive: true,
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        metadata: {
          createdDate: '2021-10-28T03:23:16.718+00:00',
          updatedDate: '2021-10-28T03:23:16.718+00:00',
        },
        name: 'Main Library',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f'],
        servicePoints: []
      }
    ]
  }
};

const renderServicePointFormContainer = () => {
  const component = () => (
    <ServicePointFormContainer
      onSave={onSaveMock}
      parentResources={parentResourcesMock}
      initialValues={initialValuesMock}
      stripes={STRIPES}
      parentMutator={parentMutatorMock}
    />
  );

  return renderWithRouter(renderWithReduxForm(component));
};

describe('ServicePointFormContainer', () => {
  it('should render ServicePointFormContainer titles', () => {
    renderServicePointFormContainer();

    expect(screen.getByRole('heading', { name: /settings.servicePoints.new/ })).toBeVisible();
  });

  it('should render ServicePointFormContainer regions', () => {
    renderServicePointFormContainer();

    const regions = [
      'Icon ui-tenant-settings.settings.servicePoints.generalInformation',
      'Icon ui-tenant-settings.settings.servicePoints.assignedLocations',
    ];

    regions.forEach((el) => expect(screen.getByRole('region', { name: el })).toBeVisible());
  });

  it('should render ServicePointFormContainer with expanded content', () => {
    renderServicePointFormContainer();

    const regions = [
      'Icon ui-tenant-settings.settings.servicePoints.generalInformation',
      'Icon ui-tenant-settings.settings.servicePoints.assignedLocations',
    ];

    regions.forEach((el) => userEvent.click(screen.getByRole('button', { name: el })));

    regions.forEach((el) => expect(screen.getByRole('region', { name: el })).toHaveAttribute('class', 'content-region'));

    userEvent.click(screen.getByRole('button', { name: 'stripes-components.expandAll' }));

    regions.forEach((el) => expect(screen.getByRole('region', { name: el })).toHaveAttribute('class', 'content-region expanded'));
  });

  it('should render ServicePointFormContainer textboxes', () => {
    renderServicePointFormContainer();

    const textboxes = [
      /settings.servicePoints.name/,
      /settings.servicePoints.code/,
      /settings.servicePoints.discoveryDisplayName/,
      /settings.servicePoints.description/,
      /settings.servicePoints.shelvingLagTime/,
    ];

    textboxes.forEach((el) => userEvent.type(screen.getByRole('textbox', { name: el }), 'new value'));

    textboxes.forEach((el) => expect(screen.getByRole('textbox', { name: el })).toHaveValue('new value'));

    userEvent.click(screen.getByRole('button', { name: /settings.general.saveAndClose/ }));
  });

  it('should render ServicePointFormContainer select with changed options', () => {
    renderServicePointFormContainer();

    userEvent.selectOptions(screen.getByRole('combobox', { name: /settings.servicePoints.pickupLocation/ }), 'true');

    expect(screen.getByRole('option', { name: /settings.servicePoints.pickupLocation.yes/ }).selected).toBe(true);
  });
});