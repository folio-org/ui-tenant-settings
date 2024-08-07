import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import LocationDetail from './LocationDetail';

import '../../../test/jest/__mocks__';


const mockInitialValues = {
  id: '1',
  servicePointIds: [
    {
      primary: true,
      selectSP: 'Circ Desk 1',
    }
  ],
};

jest.mock('../../hooks/useCampusDetails', () => ({
  useCampusDetails: jest.fn(() => ({
    campus: {},
  })),
}));

jest.mock('../../hooks/useLibraryDetails', () => ({
  useLibraryDetails: jest.fn(() => ({
    library: {},
  })),
}));

jest.mock('../../hooks/useInstitutionDetails', () => ({
  useInstitutionDetails: jest.fn(() => ({
    institution: {},
  })),
}));

jest.mock('./RemoteStorage', () => ({
  useRemoteStorageApi: () => ({
    remoteMap: {},
    configurations: [],
    setMapping: jest.fn(),
  }),
}));

jest.mock(
  '@folio/stripes-components/lib/Icon',
  () => {
    return ({ children }) => <>{children}</>;
  },
);

const renderLocationDetail = ({
  initialValues = mockInitialValues,
  servicePointsById = {
    '1': 'Circ Desk 1'
  },
  onEdit = jest.fn(),
  onClone = jest.fn(),
  onClose = jest.fn(),
  onRemove = jest.fn(),
  stripes = {
    connect: jest.fn()
  },
} = {}) => (render(
  <MemoryRouter>
    <QueryClientProvider client={new QueryClient()}>
      <LocationDetail
        initialValues={initialValues}
        servicePointsById={servicePointsById}
        onEdit={onEdit}
        onClone={onClone}
        onClose={onClose}
        onRemove={onRemove}
        stripes={stripes}
      />
    </QueryClientProvider>
  </MemoryRouter>
));

describe('LocationDetail', () => {
  it('should render all fields in location details', () => {
    renderLocationDetail();

    expect(screen.getByText(/institutions.institution/)).toBeVisible();
    expect(screen.getByText(/campuses.campus/)).toBeVisible();
    expect(screen.getByText(/libraries.library/)).toBeVisible();
    expect(screen.getByText(/locations.name/)).toBeVisible();
    expect(screen.getByText(/code/)).toBeVisible();
    expect(screen.getByText(/locations.discoveryDisplayName/)).toBeVisible();
    expect(screen.getByText(/locations.servicePoints/)).toBeVisible();
    expect(screen.getByText(/locations.status/)).toBeVisible();
    expect(screen.getByText(/locations.description/)).toBeVisible();
    expect(screen.getByText(/locations.locationDetails/)).toBeVisible();
  });

  it('should open delete confirmation modal when delete button in action menu is clicked', () => {
    const onRemove = jest.fn().mockReturnValue(Promise.resolve(true));

    renderLocationDetail({ onRemove });
    const actions = screen.getByRole('button', { name: /actions/i });

    user.click(actions);
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeVisible();

    user.click(deleteButton);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeVisible();

    const confirmButton = within(dialog).getByRole('button', { name: /delete/i });
    expect(confirmButton).toBeVisible();
    expect(within(dialog).getByRole('heading', { name: /deleteLocation/ })).toBeVisible();

    user.click(confirmButton);
    expect(onRemove).toHaveBeenCalled();
  });

  it('should call onEdit when edit button in action menu clicked', () => {
    const onEdit = jest.fn();

    renderLocationDetail({ onEdit });
    const actions = screen.getByRole('button', { name: /actions/i });

    user.click(actions);
    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toBeVisible();

    user.click(editButton);
    expect(onEdit).toHaveBeenCalled();
  });

  it('should call onClone when duplicate button in action menu clicked', () => {
    const onClone = jest.fn();

    renderLocationDetail({ onClone });
    const actions = screen.getByRole('button', { name: /actions/i });

    user.click(actions);
    const cloneButton = screen.getByRole('button', { name: /duplicate/i });
    expect(cloneButton).toBeVisible();

    user.click(cloneButton);
    expect(onClone).toHaveBeenCalled();
  });
});
