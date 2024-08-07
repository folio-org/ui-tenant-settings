import React from 'react';
import { screen } from '@testing-library/react';

import { QueryClient, QueryClientProvider } from 'react-query';
import LocationInstitutions from './LocationInstitutions';
import { renderWithRouter } from '../../test/jest/helpers';


const mockCampuses = [
  {
    'id' : '1',
    'name' : 'Københavns Universitet',
    'code' : 'KU',
  }
];

jest.mock('@folio/stripes-smart-components/lib/ControlledVocab', () => jest.fn(({
  formatter,
  label
}) => (
  <>
    <span>{label}</span>
    <span>
      {formatter.numberOfObjects(mockCampuses[0])}
    </span>
  </>
)));

jest.mock('../hooks/useCampuses', () => ({
  useCampuses: jest.fn(() => ({
    campuses: mockCampuses,
  })),
}));

const stripesMock = {
  connect: component => component,
  hasPerm: jest.fn().mockResolvedValue(true),
  config: {
    platform: 'tenant-settings'
  },
};

const renderLocationInstitutions = () => (
  renderWithRouter(
    <QueryClientProvider client={new QueryClient()}>
      <LocationInstitutions
        stripes={stripesMock}
      />
    </QueryClientProvider>

  )
);

describe('LocationInstitutions', () => {
  it('should render Institutions form', () => {
    renderLocationInstitutions();
    const numbersOfObjectsCells = screen.getAllByText('ui-tenant-settings.settings.location.institutions');

    numbersOfObjectsCells.forEach((el) => {
      expect(el).toBeVisible();
    });
  });
});
