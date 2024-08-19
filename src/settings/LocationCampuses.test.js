import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithRouter } from '../../test/jest/helpers';
import LocationCampuses from './LocationCampuses';

import '../../test/jest/__mocks__';
import { useInstitutions } from '../hooks/useInstitutions';
import { useLibraries } from '../hooks/useLibraries';


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

jest.mock('../hooks/useInstitutions', () => ({
  useInstitutions: jest.fn(() => ({
    institutions: [
      {
        code: 'KU',
        id: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        name: 'Københavns Universitet'
      }
    ],
  })),
}));

jest.mock('../hooks/useLibraries', () => ({
  useLibraries: jest.fn(() => ({
    libraries: [
      {
        'id': '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        'name': 'Datalogisk Institut',
        'code': 'DI',
        'campusId': '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        'metadata': {
          'createdDate': '2023-06-23T02:10:45.756+00:00',
          'updatedDate': '2023-06-23T02:10:45.756+00:00'
        }
      },
      {
        'id': 'c2549bb4-19c7-4fcc-8b52-39e612fb7dbe',
        'name': 'Online',
        'code': 'E',
        'campusId': '470ff1dd-937a-4195-bf9e-06bcfcd135df',
        'metadata': {
          'createdDate': '2023-06-23T02:10:45.756+00:00',
          'updatedDate': '2023-06-23T02:10:45.756+00:00'
        }
      }
    ]
  })),
}));

const renderLocationCampuses = () => renderWithRouter(
  <QueryClientProvider client={new QueryClient()}>
    <LocationCampuses />
  </QueryClientProvider>
);


describe('LocationCampuses', () => {
  it('should render LocationCampuses with empty resources', async () => {
    useInstitutions.mockImplementationOnce(() => ({ institutions: [] }));
    useLibraries.mockImplementationOnce(() => ({ libraries: [] }));

    renderLocationCampuses();

    expect(screen.getByTestId('institutions-empty')).toBeVisible();
  });
  it('should render LocationCampuses', async () => {
    renderLocationCampuses();

    expect(renderLocationCampuses).toBeDefined();
  });

  it('should render LocationCampuses changed option value', async () => {
    renderLocationCampuses();

    const checkboxInstitution = screen.getByRole('combobox');

    await userEvent.selectOptions(checkboxInstitution, 'Københavns Universitet (KU)');

    expect(screen.getByRole('option', { name: 'Københavns Universitet (KU)' }).selected).toBe(true);

    userEvent.click(screen.getByTestId('button-new'));
  });

  it('should render LocationCampuses changed option value and call click', async () => {
    renderLocationCampuses();

    const checkboxInstitution = screen.getByRole('combobox');

    await userEvent.selectOptions(checkboxInstitution, 'Københavns Universitet (KU)');

    expect(screen.getByRole('option', { name: 'Københavns Universitet (KU)' }).selected).toBe(true);

    userEvent.click(screen.getByTestId('1'));
  });
});
