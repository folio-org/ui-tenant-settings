import React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

import { render } from '@testing-library/react';

import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import '../../../../test/jest/__mocks__';

import DetailsField from './DetailsField';

const parentResourcesMock = {
  locations: {
    records: [
      {
        locations: [
          {
            campusId:'62cf76b7-cca5-4d33-9217-edf42ce1a848',
            code: 'KU/CC/DI/A',
            id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
            institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
            isActive: true,
            details: {
              name: 'Annex'
            },
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
            details: {
              name: 'Main Library'
            },
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

    ]
  }
};

const renderDetailsField = () => render(
  <Form
    onSubmit={() => {}}
    mutators={{ ...arrayMutators }}
    render={() => (
      <QueryClientProvider client={new QueryClient()}>
        <DetailsField
          resources={parentResourcesMock}
        />
      </QueryClientProvider>
    )}
  />
);
describe('DetailsField', () => {
  it('should render DetailsField', () => {
    renderDetailsField();

    expect(renderDetailsField).toBeDefined();
  });
});
