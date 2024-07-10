import React from 'react';

import '../../test/jest/__mocks__';
import {
  renderWithRouter
} from '../../test/jest/helpers';
import buildStripes from '../../test/jest/__new_mocks__/stripesCore.mock';

import Organization from './index';

const stripes = buildStripes();

const intl = {
  formatMessage: jest.fn()
};

const props = {
  stripes,
  intl,
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
  beforeEach(() => {
    stripes.discovery = {
      interfaces: {}
    };
    stripes.setIsAuthenticated = jest.fn();
    stripes.hasInterface = jest.fn().mockReturnValue(false);
    stripes.hasPerm = jest.fn().mockReturnValue(false);
  });

  it('should render SSO Settings when login-saml interface is present', () => {
    stripes.hasInterface = jest.fn().mockReturnValue(true);
    stripes.hasPerm = jest.fn().mockReturnValue(true);
    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.ssoSettings.label')).toBeTruthy();
  });

  it('should not render SSO Settings when login-saml interface is not present', () => {
    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.ssoSettings.label')).toBeNull();
  });

  it('should render Reading room access when associated permission and interface are present', () => {
    stripes.hasInterface = jest.fn().mockReturnValue(true);
    stripes.hasPerm = jest.fn().mockReturnValue(true);
    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.reading-room-access.label')).toBeTruthy();
  });

  it('should not render Reading room access when ui-tenant-settings.settings.reading-room-access.view permission is not present', () => {
    stripes.hasInterface = jest.fn().mockReturnValue(true);
    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.reading-room-access.label')).toBeNull();
  });

  it('should not render Reading room access when reading-room interface is not present', () => {
    stripes.hasPerm = jest.fn().mockReturnValue(true);
    const { queryByText } = renderWithRouter(<Organization {...props} />);
    expect(queryByText('ui-tenant-settings.settings.reading-room-access.label')).toBeNull();
  });
});
