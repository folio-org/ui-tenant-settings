import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';

import LocationLibraries from './LocationLibraries';
import { renderWithRouter } from '../../test/jest/helpers';
import { useInstitutions } from '../hooks/useInstitutions';


jest.mock('@folio/stripes-smart-components/lib/ControlledVocab', () => jest.fn(({
  rowFilter,
  label,
  rowFilterFunction,
  preCreateHook,
  listSuppressor,
  formatter
}) => (
  <>
    {label}
    <div onChange={rowFilterFunction}>{rowFilter}</div>
    {formatter.numberOfObjects(
      {
        'id' : '1',
        'name' : 'Annex',
        'code' : 'KU',
      }
    )}
    <button
      data-testid="button-new"
      type="button"
      onClick={() => {
        preCreateHook();
        listSuppressor();
      }}
    >
      New
    </button>
  </>
)));

jest.mock('../hooks/useCampuses', () => ({
  useCampuses: jest.fn(() => ({
    campuses: [
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
        name: 'Online'
      }
    ],
  })),
}));

jest.mock('../hooks/useInstitutions', () => ({
  useInstitutions: jest.fn(() => ({
    institutions: [
      {
        code: 'KU',
        id: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        name: 'Københavns Universitet'
      }
    ]
  })),
}));

jest.mock('../hooks/useLocations', () => ({
  useLocations: jest.fn(() => ({
    locations: [
      {
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU/CC/DI/A',
        id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Annex',
      },
      {
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU',
        discoveryDisplayName: 'Dematic',
        id: '0975ac04-21c7-4fd3-ae9b-33ff22453024',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Dematic',
      }
    ]
  })),
}));


const renderLocationLibaries = () => renderWithRouter(
  <QueryClientProvider client={new QueryClient()}>
    <LocationLibraries />
  </QueryClientProvider>
);


describe('LocationLibraries', () => {
  it('should render LocationLibraries with empty resources', async () => {
    useInstitutions.mockImplementationOnce(() => ({ institutions: [] }));

    renderLocationLibaries();

    expect(screen.getByTestId('libraries-empty')).toBeVisible();
  });

  it('should render LocationLibraries with resourses', async () => {
    renderLocationLibaries();

    expect(renderLocationLibaries).toBeDefined();
  });

  it('should render LocationLibraries changed option value', async () => {
    renderLocationLibaries();

    const checkboxInstitution = screen.getAllByRole('combobox')[0];

    await userEvent.selectOptions(checkboxInstitution, 'Københavns Universitet (KU)');

    expect(screen.getByRole('option', { name: 'Københavns Universitet (KU)' }).selected).toBe(true);

    userEvent.click(screen.getByTestId('button-new'));
  });

  it('should render LocationLibraries with filled form', async () => {
    renderLocationLibaries();

    const checkboxInstitution = screen.getByRole('combobox', { name: 'ui-tenant-settings.settings.location.institutions.institution' });

    await userEvent.selectOptions(checkboxInstitution, 'Københavns Universitet (KU)');

    expect(screen.getByRole('option', { name: 'Københavns Universitet (KU)' }).selected).toBe(true);

    const checkBoxCampuses = screen.getByRole('combobox', { name: 'ui-tenant-settings.settings.location.campuses.campus' });

    await userEvent.selectOptions(checkBoxCampuses, 'City Campus (CC)');

    userEvent.click(screen.getByTestId('1'));
  });
});
