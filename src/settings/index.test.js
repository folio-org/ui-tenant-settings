import React from 'react';

import { renderWithRouter } from '../../test/jest/helpers';
import Organization from './index';

import '../../test/jest/__mocks__';
import { mockHasInterface, mockHasPerm } from '../../test/jest/__mocks__/stripesCore.mock';

const props = {
  history: {},
  location: {
    pathname: '/tenant-settings'
  },
  match: {
    path: '/tenant-settings',
    params: {
      id: '1'
    }
  }
};

describe('Organization', () => {
  it('should render SSO Settings when login-saml interface is present', () => {
    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.ssoSettings.label')).toBeTruthy();
  });

  it('should not render SSO Settings when login-saml interface is not present', () => {
    mockHasInterface.mockReturnValue(false);
    mockHasPerm.mockReturnValue(false);

    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.ssoSettings.label')).toBeNull();
  });

  it('should not render Reading room access when ui-tenant-settings.settings.reading-room-access.view permission is not present', () => {
    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.reading-room-access.label')).toBeNull();
  });

  it('should not render Reading room access when reading-room interface is not present', () => {
    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.reading-room-access.label')).toBeNull();
  });

  it('should render Reading room access when associated permission and interface are present', () => {
    mockHasInterface.mockReturnValue(true);
    mockHasPerm.mockReturnValue(true);

    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.reading-room-access.label')).toBeTruthy();
  });
});
