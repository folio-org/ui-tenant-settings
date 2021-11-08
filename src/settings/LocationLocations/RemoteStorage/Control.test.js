import React from 'react';

import { screen, render } from '@testing-library/react';

import '../../../../test/jest/__mocks__';
import buildStripes from '../../../../test/jest/__new_mocks__/stripesCore.mock';

import { RemoteStorageApiProvider } from './Provider';
import { Control } from './Control';

const STRIPES = buildStripes();

const dataOptionsMock = [
  {
    value: 'First label',
    label: 'first_label',
  },
  {
    value: 'Second label',
    label: 'second_label',
  },
];

const mutatorMock = {
  configurations: {
    reset: jest.fn(() => Promise.resolve()),
    GET: jest.fn(() => Promise.resolve()),
  }
};

const resourcesMock = {
  configurations: {
    failed: false,
    failedMutations: [],
    hasLoaded: false,
    isPending: false,
    pendingMutations: [],
    records: [],
    successfulMutations: [],
  },
  mappings: {
    failed: false,
    failedMutations: [],
    hasLoaded: false,
    isPending: false,
    pendingMutations: [],
    records: [],
    successfulMutations: [],
  }
};

const renderControl = () => render(
  <RemoteStorageApiProvider
    stripes={STRIPES}
    mutator={mutatorMock}
    resources={resourcesMock}
  >
    <Control
      label={<span>Control</span>}
      sub={<span>SubControl</span>}
      dataOptions={dataOptionsMock}
    />
  </RemoteStorageApiProvider>
);

describe('Control', () => {
  it('should render Control', async () => {
    renderControl();

    const options = [
      'first_label',
      'second_label'
    ];

    expect(screen.getByRole('combobox')).toBeVisible();

    options.forEach((el) => expect(screen.getByText(el)).toBeVisible());
  });
});
