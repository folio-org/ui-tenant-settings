import React from 'react';
import { screen, render } from '@testing-library/react';

import LocationInstitutions from './LocationInstitutions';

jest.mock('@folio/stripes-smart-components/lib/ControlledVocab', () => jest.fn(({
  formatter,
  label
}) => (
  <>
    <span>{label}</span>
    <span>
      {formatter.numberOfObjects(
        {
          'id' : '1',
          'name' : 'Københavns Universitet',
          'code' : 'KU',
        }
      )}
    </span>
  </>
)));

const stripesMock = {
  connect: component => component,
};

const resourcesMock = {
  locationsPerInstitution: {
    records: [
      {
        'id' : '1',
        'name' : 'Annex',
        'code' : 'KU/CC/DI/A',
        'isActive' : true,
        'institutionId' : '1',
        'campusId' : '1',
        'libraryId' : '1',
        'primaryServicePoint' : '1',
        'servicePointIds' : ['1'],
        'servicePoints' : [],
      },
    ]
  },
};

const mutatorMock = {
  locationsPerInstitution: {
    GET: jest.fn(),
    reset: jest.fn(),
  }
};

const renderLocationInstitutions = () => (
  render(
    <LocationInstitutions
      mutator={mutatorMock}
      stripes={stripesMock}
      resources={resourcesMock}
    />
  )
);

describe('LocationInstitutions', () => {
  it('should render Institutions form', () => {
    renderLocationInstitutions();

    expect(mutatorMock.locationsPerInstitution.GET).toBeCalled();
    expect(mutatorMock.locationsPerInstitution.reset).toBeCalled();
    expect(screen.getByText(/settings.location.institutions/)).toBeVisible();
  });
});
