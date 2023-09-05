import React from 'react';

import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import { renderWithRouter } from '../../../test/jest/helpers';

import Plugins from './Plugins';

const setSinglePlugin = jest.fn();
const hasPermMock = jest.fn().mockReturnValue(true);

const renderPlugins = (props) => renderWithRouter(<Plugins {...props} />);

describe('Plugins', () => {
  afterEach(() => {
    setSinglePlugin.mockClear();
    hasPermMock.mockClear();
  });

  it('should render plugins', async () => {
    const { findAllByText } = await renderPlugins({ label: 'plugins',
      stripes: {
        setSinglePlugin,
        hasPerm: hasPermMock,
        logger: {
          log: jest.fn(),
        },
      },
      resources: {} });
    expect(await findAllByText('plugins')).toBeDefined();
  });

  it('should choose and save plugin', async () => {
    renderPlugins({ label: 'plugins',
      stripes: {
        setSinglePlugin,
        hasPerm: hasPermMock,
        logger: {
          log: jest.fn(),
        },
      },
      resources: {},
      mutator: {
        settings: { POST: jest.fn() }
      } });

    user.selectOptions(screen.getByTestId('find-instance'), ['@folio/plugin-find-instance']);
    user.click(screen.getByRole('button', { type: /submit/i }));

    expect(setSinglePlugin).toHaveBeenCalledTimes(1);
  });

  it('submit button should not be present without permissions', async () => {
    hasPermMock.mockReturnValueOnce(false);

    renderPlugins({ label: 'plugins',
      stripes: {
        setSinglePlugin,
        hasPerm: hasPermMock,
        logger: {
          log: jest.fn(),
        },
      },
      resources: {},
      mutator: {
        settings: { POST: jest.fn() }
      } });

    expect(screen.queryByRole('button', { type: /submit/i })).toBeNull();
  });
});
