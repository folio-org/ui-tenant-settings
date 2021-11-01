import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mocks__';
import buildStripes from '../../test/jest/__new_mocks__/stripesCore.mock';
import {
  renderWithRouter, renderWithReduxForm,
} from '../../test/jest/helpers';

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
  locationsPerCampus: {
    records: [
      {
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU/CC/DI/A',
        id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Annex',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f'],
      },
      {
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        code: 'KU',
        discoveryDisplayName: 'Dematic',
        id: '0975ac04-21c7-4fd3-ae9b-33ff22453024',
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        name: 'Dematic',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f'],
      }
    ]
  }
};

const mutatorMock = {
  locationsPerCampus: {
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
});
