import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mocks__';
import buildStripes from '../../test/jest/__new_mocks__/stripesCore.mock';
import { renderWithRouter } from '../../test/jest/helpers';

import LocationCampuses from './LocationCampuses';

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

const STRIPES = buildStripes();

const resourcesMock = {
  institutions: {
    records: [
      { code: 'KU',
        id: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        name: 'Københavns Universitet' }
    ]
  },
  libraries: {
    records:
          [
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
  }
};

const mutatorMock = {
  libraries: {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
  },
  institutions: {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
  },
};

const renderLocationCampuses = (resources = {}) => renderWithRouter(
  <LocationCampuses
    mutator={mutatorMock}
    resources={resources}
    stripes={STRIPES}
  />
);


describe('LocationCampuses', () => {
  it('should render LocationCampuses with empty resources', async () => {
    renderLocationCampuses();

    expect(screen.getByTestId('institutuins-empty')).toBeVisible();
  });
  it('should render LocationCampuses', async () => {
    renderLocationCampuses(resourcesMock);

    expect(renderLocationCampuses).toBeDefined();
  });

  it('should render LocationCampuses changed option value', async () => {
    renderLocationCampuses(resourcesMock);

    const checkboxInstitution = screen.getByRole('combobox');

    await userEvent.selectOptions(checkboxInstitution, 'Københavns Universitet (KU)');

    expect(screen.getByRole('option', { name: 'Københavns Universitet (KU)' }).selected).toBe(true);

    userEvent.click(screen.getByTestId('button-new'));
  });

  it('should render LocationCampuses changed option value and call click', async () => {
    renderLocationCampuses(resourcesMock);

    const checkboxInstitution = screen.getByRole('combobox');

    await userEvent.selectOptions(checkboxInstitution, 'Københavns Universitet (KU)');

    expect(screen.getByRole('option', { name: 'Københavns Universitet (KU)' }).selected).toBe(true);

    userEvent.click(screen.getByTestId('1'));
  });
});
