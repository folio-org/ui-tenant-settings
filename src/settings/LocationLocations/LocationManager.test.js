import React from 'react';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { QueryClient, QueryClientProvider } from 'react-query';
import userEvent from '@testing-library/user-event';

import {
  renderWithRouter
} from '../../../test/jest/helpers';
import LocationManager from './LocationManager';

import '../../../test/jest/__mocks__';


jest.mock('./RemoteStorage/Provider', () => ({
  ...jest.requireActual('./RemoteStorage/Provider'),
  useRemoteStorageApi: () => ({
    remoteMap: {},
    mappings: [],
    configurations: [],
    translate: () => 'str'
  })
}));

jest.mock('../../hooks/useCampuses', () => ({
  useCampuses: jest.fn(() => ({
    campuses: [
      { code: 'DI',
        id: '40ee00ca-a518-4b49-be01-0638d0a4ac57ff',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        name: 'City Campus' },
      {
        code: 'DI',
        id: '40ee00ca-a518-4b49-be01-0638d0a4ac57f',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        name: 'Online'
      }
    ],
  })),
}));

jest.mock('../../hooks/useInstitutions', () => ({
  useInstitutions: jest.fn(() => ({
    institutions: [
      {
        code: 'KU',
        id: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        name: 'Københavns Universitet',
      }
    ],
  })),
}));

jest.mock('../../hooks/useLibraries', () => ({
  useLibraries: jest.fn(() => ({
    libraries: [
      {
        campusId: '40ee00ca-a518-4b49-be01-0638d0a4ac57ff',
        code: 'DI',
        id: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Datalogisk Institut'
      }
    ],
  })),
}));

jest.mock('../../hooks/useLocations', () => ({
  useLocations: jest.fn(() => ({
    locations: [
      {
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU/CC/DI/2',
        id: 'f34d27c6-a8eb-461b-acd6-5dea81771e70',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        isActive: true,
        detaild: {},
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Annex',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f'],
        servicePoints: [],
      },
      {
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU/CC/DI/M',
        id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        isActive: true,
        detaild: {},
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Annex',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f'],
        servicePoints: []
      }
    ]
  })),
}));

jest.mock('../../hooks/useServicePoints', () => ({
  useServicePoints: jest.fn(() => ({
    servicePoints: [
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
  })),
}));

jest.mock('../../hooks/useLocationCreate', () => ({
  useLocationCreate: jest.fn(() => ({
    createLocation: jest.fn(),
    isCreatingLocation: false,
  })),
}));

jest.mock('../../hooks/useLocationUpdate', () => ({
  useLocationUpdate: jest.fn(() => ({
    updateLocation: jest.fn(),
    isUpdatingLocation: false,
  })),
}));


const history = createMemoryHistory();

const renderLocationManager = () => renderWithRouter(
  <QueryClientProvider client={new QueryClient()}>
    <LocationManager
      label={<span>ServicePointManager</span>}
    />
  </QueryClientProvider>
);

describe('LocationManager', () => {
  beforeEach(() => {
    const overlayContainer = document.createElement('div');

    overlayContainer.id = 'ModuleContainer';
    document.body.append(overlayContainer);
  });

  it('should render LocationManager', () => {
    const { container } = renderLocationManager();

    const buttons = [
      /stripes-components.button.new/,
      /stripes-components.collapseAll/,
      /Icon ui-tenant-settings.settings.location.locations.generalInformation/,
      /Icon ui-tenant-settings.settings.location.locations.locationDetails/,
      /stripes-components.saveAndClose/
    ];

    buttons.forEach((el) => userEvent.click(screen.getByRole('button', { name: el })));

    buttons.forEach((el) => expect(screen.getByRole('button', { name: el })).toBeVisible());

    userEvent.click(container.querySelector('#clickable-close-locations-location'));
  });

  it('should render select Instutions', () => {
    renderLocationManager();

    const selectInstitution = screen.getAllByRole('combobox', { name: 'ui-tenant-settings.settings.location.institutions.institution' });
    const institutionOptions = screen.getAllByRole('option', { name: 'Københavns Universitet (KU)' });


    selectInstitution.forEach((el, index) => userEvent.selectOptions(
      el,
      institutionOptions[index]
    ));

    institutionOptions.forEach((el) => expect(el.selected).toBe(true));

    const selectCampus = screen.getAllByRole('combobox', { name: 'ui-tenant-settings.settings.location.campuses.campus' });
    const campusOption = screen.getAllByRole('option', { name: 'City Campus (DI)' });

    selectCampus.forEach((el, index) => userEvent.selectOptions(
      el,
      campusOption[index]
    ));

    campusOption.forEach((el) => expect(el.selected).toBe(true));

    const selectLibrary = screen.getAllByRole('combobox', { name: 'ui-tenant-settings.settings.location.libraries.library' });
    const libraryOption = screen.getAllByRole('option', { name : 'Datalogisk Institut (DI)' });

    selectLibrary.forEach((el, index) => userEvent.selectOptions(
      el,
      libraryOption[index]
    ));

    libraryOption.forEach((el) => expect(el.selected).toBe(true));
  });

  it('should render select Service points', () => {
    renderLocationManager();

    userEvent.selectOptions(
      screen.getByRole('combobox', { name: /settings.location.locations.status/ }),
      screen.getByRole('option', { name: /settings.location.locations.inactive/ }),
    );
    expect(screen.getByRole('option', { name: /settings.location.locations.inactive/ }).selected).toBe(true);
  });

  it('should render detailPage', () => {
    const newMatchMock = {
      path: '/settings/tenant-settings/location-locations',
      isExact: true,
      params: {}
    };
    history.push('53cf956f-c1df-410b-8bea-27f712cca7c0');

    renderLocationManager(newMatchMock);
  });
});
