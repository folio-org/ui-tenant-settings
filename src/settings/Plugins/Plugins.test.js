import React from 'react';

import { act, waitFor, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import {
  stripesConnect,
  renderWithRouter,
} from '../../../test/jest/helpers';

import Plugins from './Plugins';

const setSinglePlugin = jest.fn();

const ConnectedPlugins = stripesConnect(Plugins, {
  stripes: {
    setSinglePlugin,
  },
});

const renderPlugins = (props) => renderWithRouter(<ConnectedPlugins {...props} />);

describe('Plugins', () => {
  afterEach(() => {
    setSinglePlugin.mockClear();
  });

  it('should render plugins', async () => {
    const { findAllByText } = await renderPlugins({ label: 'plugins' });
    expect(await findAllByText('plugins')).toBeDefined();
  });

  it('should choose and save plugin', async () => {
    await act(async () => {
      await renderPlugins({ label: 'plugins' });

      await user.selectOptions(screen.getByTestId('find-instance'), ['@folio/plugin-find-instance']);
      await waitFor(() => expect(screen.getByRole('button', { type: /submit/i })).toBeEnabled());

      user.click(screen.getByRole('button', { type: /submit/i }));
    });

    expect(setSinglePlugin).toHaveBeenCalledTimes(1);
  });
});
