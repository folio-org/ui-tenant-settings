import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { renderWithRouter } from '../../../test/jest/helpers';
import Plugins from './Plugins';

import '../../../test/jest/__mocks__';
import { mockHasPerm } from '../../../test/jest/__mocks__/stripesCore.mock';

const mockCreateConfiguration = jest.fn(() => Promise.resolve());

jest.mock('../../hooks/useConfigurationsCreate', () => ({
  useConfigurationsCreate: jest.fn(() => ({
    createConfiguration: mockCreateConfiguration,
    isCreatingConfiguration: false,
  })),
}));

const renderPlugins = (props) => renderWithRouter(
  <QueryClientProvider client={new QueryClient()}>
    <Plugins {...props} />
  </QueryClientProvider>
);

describe('Plugins', () => {
  afterEach(() => {
    mockHasPerm.mockClear();
  });

  it('should render plugins', async () => {
    const { findAllByText } = await renderPlugins({ label: 'plugins' });

    expect(await findAllByText('plugins')).toBeDefined();
  });

  it('should choose and save plugin', async () => {
    renderPlugins({ label: 'plugins' });

    user.selectOptions(screen.getByTestId('find-instance'), ['@folio/plugin-find-instance']);
    user.click(screen.getByRole('button', { type: /submit/i }));

    expect(mockCreateConfiguration).toHaveBeenCalledTimes(1);
  });

  it('submit button should not be present without permissions', async () => {
    mockHasPerm.mockReturnValueOnce(false);

    renderPlugins({ label: 'plugins' });

    expect(screen.queryByRole('button', { type: /submit/i })).toBeNull();
  });
});
