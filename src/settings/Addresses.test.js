import React from 'react';

import { screen } from '@testing-library/react';
import { configure } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import '../../test/jest/__mocks__';
import buildStripes from '../../test/jest/__new_mocks__/stripesCore.mock';
import {
  renderWithRouter, renderWithReduxForm
} from '../../test/jest/helpers';

import Addresses from './Addresses';

const STRIPES = buildStripes();

jest.useFakeTimers();

const mutatorPostMock = jest.fn(() => Promise.resolve());

const mutatorPutMock = jest.fn(() => Promise.resolve());

const mutatorMock = {
  activeRecord: {
    update: jest.fn(() => Promise.resolve()),
  },
  values: {
    PUT: mutatorPutMock,
    DELETE: jest.fn(() => Promise.resolve()),
    GET: jest.fn(() => Promise.resolve()),
    POST: mutatorPostMock
  },
  updaters: {
    type: 'okapi',
    records: 'users',
    path: 'users',
    GET: jest.fn(() => Promise.resolve())
  },
};

const resourcesMock = {
  values: {
    dataKey: 'addresses',
    failed: false,
    hasLoaded: true,
    httpStatus: 200,
    isPending: false,
    module: '@folio/tenant-settings',
    records:[{
      code: 'ADDRESS_1635329686543',
      configName: 'tenant.addresses',
      enabled: true,
      id: 'beca0c12-204b-4d85-b72e-9358535c564e',
      module: 'TENANT',
      value: '{"name":"Test","address":"City"}',
    }]
  },
};

configure({
  asyncUtilTimeout: 5000,
});

const renderAddresses = () => {
  const component = () => (
    <Addresses
      mutator={mutatorMock}
      resources={resourcesMock}
      stripes={STRIPES}
    />
  );

  return renderWithRouter(renderWithReduxForm(component));
};

describe('Addresses', () => {
  it('should render addresses titles', async () => {
    await renderAddresses();

    const addressesTitles = screen.getAllByText('ui-tenant-settings.settings.addresses.label');

    addressesTitles.forEach((el) => expect(el).toBeVisible());
  });

  it('should render new button', async () => {
    await renderAddresses();

    expect(screen.getByRole('button', { name: 'stripes-core.button.new' })).toBeVisible();
  });

  it('should render correct result column', async () => {
    await renderAddresses();

    const columnHeaders = [
      /settings.addresses.name/,
      /settings.addresses.address/,
      /cv.lastUpdated/
    ];

    columnHeaders.forEach((el) => expect(screen.getByRole('columnheader', { name: el })).toBeVisible());
  });

  it('should render correct result values', async () => {
    await renderAddresses();

    const values = [
      'City',
      'Test',
      '-'
    ];

    values.forEach((el) => expect(screen.getByRole('gridcell', { name: el })).toBeVisible());
  });

  it('should render new form', async () => {
    await renderAddresses();

    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.new' }));

    const textBoxex = screen.getAllByRole('textbox');

    textBoxex.forEach((el) => expect(el).toHaveValue(''));
  });

  it('should render addresses with empty results', async () => {
    await renderAddresses();

    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.new' }));

    const textBoxex = screen.getAllByRole('textbox');

    textBoxex.forEach((el) => userEvent.type(el, 'test'));

    userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.save' }));

    expect(mutatorPostMock).toHaveBeenCalled();
  });

  it('should edit item', async () => {
    await renderAddresses();

    userEvent.click(screen.getByRole('button', { name: 'stripes-components.editThisItem' }));

    const textBoxex = screen.getAllByRole('textbox');

    textBoxex.forEach((el) => userEvent.type(el, 'new value'));

    userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.save' }));

    expect(mutatorPutMock).toHaveBeenCalled();
  });
});
