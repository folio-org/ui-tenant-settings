import React from 'react';
import { render, screen } from '@testing-library/react';
import { useIntl } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';

import { TENANT_ADDRESSES_API } from '../constants';
import Addresses from './Addresses';

jest.mock('@folio/stripes/smart-components', () => ({
  ControlledVocab: jest.fn(() => <div>ControlledVocab</div>),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
  TitleManager: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: jest.fn(),
  FormattedMessage: jest.fn(({ id }) => <div>{id}</div>),
}));

const mockStripes = {
  hasPerm: jest.fn(() => true),
  user: {
    user: {
      id: 'test-user-id',
    },
  },
  connect: jest.fn(component => component),
};

const mockIntl = {
  formatMessage: jest.fn(({ id }) => id),
};

describe('Addresses', () => {
  beforeEach(() => {
    useStripes.mockReturnValue(mockStripes);
    useIntl.mockReturnValue(mockIntl);
    jest.clearAllMocks();
  });

  it('should render ControlledVocab component', () => {
    render(<Addresses />);
    expect(screen.getByText('ControlledVocab')).toBeInTheDocument();
  });

  it('should pass correct props to ControlledVocab', () => {
    render(<Addresses />);

    expect(ControlledVocab).toHaveBeenCalledWith(
      expect.objectContaining({
        baseUrl: TENANT_ADDRESSES_API,
        records: 'addresses',
        label: 'ui-tenant-settings.settings.addresses.label',
        nameKey: 'name',
        id: 'addresses',
        sortby: 'name',
        editable: true,
      }),
      expect.anything()
    );
  });

  it('should pass correct visibleFields and columnMapping', () => {
    render(<Addresses />);

    const calledProps = ControlledVocab.mock.calls[0][0];
    expect(calledProps.visibleFields).toEqual(['name', 'address']);
    expect(calledProps.hiddenFields).toEqual(['numberOfObjects']);
    expect(calledProps.columnMapping).toBeDefined();
  });

  it('should set editable to false when user lacks permission', () => {
    mockStripes.hasPerm.mockReturnValue(false);
    render(<Addresses />);

    expect(ControlledVocab).toHaveBeenCalledWith(
      expect.objectContaining({
        editable: false,
      }),
      expect.anything()
    );
  });

  describe('parseRow', () => {
    it('should parse row correctly', () => {
      render(<Addresses />);
      const calledProps = ControlledVocab.mock.calls[0][0];
      const parseRow = calledProps.parseRow;

      const row = {
        id: 'row-id',
        name: 'Test Name',
        address: 'Test Address',
      };
      const result = parseRow(row);

      expect(result).toEqual({
        id: 'row-id',
        name: 'Test Name',
        address: 'Test Address',
      });
    });
  });

  describe('formatter', () => {
    it('should format address field with correct CSS class', () => {
      render(<Addresses />);
      const calledProps = ControlledVocab.mock.calls[0][0];
      const addressFormatter = calledProps.formatter.address;

      const item = { address: 'Test Address Content' };
      const result = addressFormatter(item);

      expect(result.type).toBe('div');
      expect(result.props.className).toContain('addressWrapper');
      expect(result.props.children).toBe('Test Address Content');
    });
  });

  describe('fieldComponents', () => {
    it('should have correct field components', () => {
      render(<Addresses />);
      const calledProps = ControlledVocab.mock.calls[0][0];
      const fieldComponents = calledProps.fieldComponents;

      expect(fieldComponents).toHaveProperty('address');
      expect(fieldComponents).toHaveProperty('name');
    });
  });

  describe('translations', () => {
    it('should pass correct translation keys', () => {
      render(<Addresses />);
      const calledProps = ControlledVocab.mock.calls[0][0];
      const translations = calledProps.translations;

      expect(translations).toEqual({
        cannotDeleteTermHeader: 'ui-tenant-settings.settings.addresses.cannotDeleteTermHeader',
        cannotDeleteTermMessage: 'ui-tenant-settings.settings.addresses.cannotDeleteTermMessage',
        deleteEntry: 'ui-tenant-settings.settings.addresses.deleteEntry',
        termDeleted: 'ui-tenant-settings.settings.addresses.termDeleted',
        termWillBeDeleted: 'ui-tenant-settings.settings.addresses.termWillBeDeleted',
      });
    });
  });
});

