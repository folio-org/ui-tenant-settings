import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import LocationDetail from './LocationDetail';

const mockInitialValues = {
  id: '1',
  servicePointIds: [],
};

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
    useRemoteStorageApi: () => ({ setMapping: jest.fn() }),
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

    expect(screen.queryByText('ui-tenant-settings.settings.location.institutions.institution')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.campuses.campus')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.libraries.library')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.locations.name')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.code')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.locations.discoveryDisplayName')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.locations.servicePoints')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.locations.status')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.locations.description')).toBeVisible();
    expect(screen.queryByText('ui-tenant-settings.settings.location.locations.locationDetails')).toBeVisible();
  });

  it('should open delete confirmation modal when delete button in action menu is clicked', () => {
    renderLocationDetail();
    const actions = screen.getByRole('button', { name: /actions/i });

    user.click(actions);
    const delete = screen.getByRole('button', { name: /delete/i });
    expect(delete).toBeVisible();

    user.click(delete);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeVisible();
    expect(within(dialog).getByRole('heading', { name: /deleteLocation/ })).toBeVisible();
  });

  it('should call onEdit when edit button in action menu clicked', () => {
    const onEdit = jest.fn();

    renderLocationDetail({ onEdit });
    const editButton = screen.queryByText('stripes-components.button.edit');

    user.click(editButton);
    expect(onEdit).toHaveBeenCalled();
  });

  it('should call onClone when duplicate button in action menu clicked', () => {
    const onClone = jest.fn();

    renderLocationDetail({ onClone });
    const cloneButton = screen.queryByText('stripes-components.button.duplicate');

    user.click(cloneButton);
    expect(onClone).toHaveBeenCalled();
  });
});
