import React from 'react';

import { act, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import {
  withStripes,
  renderWithRouter
} from '../../../test/jest/helpers';

import Bindings from './Bindings';

const setBindings = jest.fn();

const BindingWithStripes = withStripes(Bindings, {
  stripes: {
    setBindings,
  },
  resources: {
    settings: {
      hasLoaded: true,
      records: [{ configName: 'bindings', module: 'ORG', value: '' }],
    },
  },
});

const renderBindings = (props) => renderWithRouter(<BindingWithStripes {...props} />);

describe.skip('Bindings', () => {
  afterEach(() => {
    setBindings.mockClear();
  });

  it('should render bindings', async () => {
    const { findAllByText } = await renderBindings({ label: 'binding' });
    expect(await findAllByText('binding')).toBeDefined();
  });

  it('should fill and save bindings', async () => {
    renderBindings({ label: 'binding' });

    await act(async () => {
      const textarea = screen.getByRole('textbox', { name: /binding/i });

      // paste is needed to avoid form validation on each letter which fails each time;
      // as the outcome characters are also not being added
      user.paste(textarea, '{"test": "test"}');

      await waitFor(() => expect(screen.getByRole('button', { type: /submit/i })).toBeEnabled());

      user.click(screen.getByRole('button', { type: /submit/i }));
    });

    expect(setBindings).toHaveBeenCalledTimes(1);
  });
});
