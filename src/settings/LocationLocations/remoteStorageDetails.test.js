import React from 'react';
import { render, screen } from '@testing-library/react';

import RemoteStorageDetails from './RemoteStorageDetails';

const mockConfigurations = {
  records: [
    { name: 'RS1', id: 1 },
    { name: 'RS2', id: 2, returningWorkflowDetails: 'Scanned to folio' }
  ]
};

const mockRemoteMap = {
  locationWithoutDetails: 1,
  locationWithDetails: 2,
};

// jest.mock('@folio/stripes/components', () => ({
//   ...jest.requireActual('@folio/stripes/components'),
//   KeyValue: jest.fn(({ label, children }) => (
//     <>
//       <span>{label}</span>
//       <span>{children}</span>
//     </>
//   )),
// }));

jest.mock(
  './RemoteStorage',
  () => ({
    useRemoteStorageApi: () => ({ remoteMap: mockRemoteMap, configurations: mockConfigurations }),
  }),
);

const renderRemoteStorageDetails = ({
  locationId
}) => (render(
  <RemoteStorageDetails locationId={locationId} />
));

describe('RemoteStorageDetails', () => {
  it('should render remote storage name and workflow preference if location have them', () => {
    renderRemoteStorageDetails({ locationId: 'locationWithDetails' });

    expect(screen.queryByText('ui-tenant-settings.settings.location.locations.remoteStorage')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.locations.returning-workflow.title')).toBeVisible();
  });

  it('should not render workflow preference if location have not it', () => {
    renderRemoteStorageDetails({ locationId: 'locationWithoutDetails' });

    expect(screen.queryByText('ui-tenant-settings.settings.location.locations.returning-workflow.title')).not.toBeInTheDocument();
  });
});
