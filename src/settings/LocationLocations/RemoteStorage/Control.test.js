import React from 'react';

import { screen, render } from '@testing-library/react';

import '../../../../test/jest/__mocks__';

import { QueryClientProvider, QueryClient } from 'react-query';
import { RemoteStorageApiProvider } from './Provider';
import { Control } from './Control';


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
    records: [
      {
        configurationId: 'de17bad7-2a30-4f1c-bee5-f653ded15629',
        folioLocationId: '53cf956f-c1df-410b-8bea-27f712cca7c0'
      },
      {
        configurationId: 'de17bad7-2a30-4f1c-bee5-f653ded15629',
        folioLocationId: 'c0762159-8fe3-4cbc-ae64-fa274f7acc47'
      }
    ],
    successfulMutations: [],
  }
};

const renderControl = () => render(
  <QueryClientProvider client={new QueryClient()}>
    <RemoteStorageApiProvider
      mutator={mutatorMock}
      resources={resourcesMock}
    >
      <Control
        label={<span>Control</span>}
        sub={<span>SubControl</span>}
        dataOptions={dataOptionsMock}
      />
    </RemoteStorageApiProvider>
  </QueryClientProvider>
);

describe('Control', () => {
  it('should render Control', () => {
    renderControl();

    const options = [
      'first_label',
      'second_label'
    ];

    expect(screen.getByRole('combobox')).toBeVisible();

    options.forEach((el) => expect(screen.getByText(el)).toBeVisible());
  });
});
