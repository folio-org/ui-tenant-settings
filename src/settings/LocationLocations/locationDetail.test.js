import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import LocationDetail from './LocationDetail';

const mockInitialValues = {
  id: '1',
  servicePointIds: [],
};

const mockSetMapping = jest.fn();

jest.mock(
  '@folio/stripes/core',
  () => ({
    stripesConnect: Component => props => <Component {...props} />,
    IfPermission : ({ children }) => <>{children}</>
  }),
);

jest.mock(
  '@folio/stripes-components/lib/Icon',
  () => {
    return ({ children }) => <>{children}</>;
  },
);

jest.mock(
  './RemoteStorage',
  () => ({
    useRemoteStorageApi: () => ({ setMapping: mockSetMapping }),
  }),
);

const renderLocationDetail = ({
  initialValues = mockInitialValues,
  resources = {
    institutions: {},
    campuses: {},
    libraries: {},
  },
  servicePointsById = {},
  onEdit = jest.fn(),
  onClone = jest.fn(),
  onClose = jest.fn(),
  onRemove = jest.fn(),
  stripes = {
    connect: jest.fn()
  },
} = {}) => (render(
  <MemoryRouter>
    <LocationDetail
      initialValues={initialValues}
      resources={resources}
      servicePointsById={servicePointsById}
      onEdit={onEdit}
      onClone={onClone}
      onClose={onClose}
      onRemove={onRemove}
      stripes={stripes}
    />
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
    expect(mockSetMapping).toHaveBeenCalled();
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
