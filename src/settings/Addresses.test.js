import React from 'react';
import { render, screen } from '@testing-library/react';
import { useIntl } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';

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
        baseUrl: 'settings/entries',
        records: 'items',
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

  describe('preCreateHook', () => {
    it('should create item with correct structure', () => {
      render(<Addresses />);
      const calledProps = ControlledVocab.mock.calls[0][0];
      const onCreate = calledProps.preCreateHook;

      const item = { name: 'Test Address', address: '123 Main St' };
      const result = onCreate(item);

      expect(result).toMatchObject({
        scope: 'ui-tenant-settings.addresses.manage',
        value: item,
      });
      expect(result.key).toMatch(/^ADDRESS_\d+$/);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.createdByUserId).toBe('test-user-id');
      expect(result.metadata.updatedByUserId).toBe('test-user-id');
      expect(result.metadata.createdDate).toBeDefined();
      expect(result.metadata.updatedDate).toBeDefined();
    });
  });

  describe('preUpdateHook', () => {
    it('should update item with correct structure', () => {
      render(<Addresses />);
      const calledProps = ControlledVocab.mock.calls[0][0];
      const onUpdate = calledProps.preUpdateHook;

      const item = {
        id: 'item-id',
        key: 'ADDRESS_123',
        name: 'Updated Address',
        address: '456 Oak Ave',
        metadata: {
          createdByUserId: 'original-user',
          createdDate: '2023-01-01T00:00:00.000Z',
        },
      };
      const result = onUpdate(item);

      expect(result).toMatchObject({
        scope: 'ui-tenant-settings.addresses.manage',
        key: 'ADDRESS_123',
        id: 'item-id',
        value: {
          name: 'Updated Address',
          address: '456 Oak Ave',
        },
      });
      expect(result.metadata.createdByUserId).toBe('original-user');
      expect(result.metadata.updatedByUserId).toBe('test-user-id');
      expect(result.metadata.updatedDate).toBeDefined();
    });
  });

  describe('parseRow', () => {
    it('should parse row correctly', () => {
      render(<Addresses />);
      const calledProps = ControlledVocab.mock.calls[0][0];
      const parseRow = calledProps.parseRow;

      const row = {
        id: 'row-id',
        value: {
          name: 'Test Name',
          address: 'Test Address',
        },
      };
      const result = parseRow(row);

      expect(result).toEqual({
        id: 'row-id',
        name: 'Test Name',
        address: 'Test Address',
        value: {
          name: 'Test Name',
          address: 'Test Address',
        },
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

  describe('manifest', () => {
    it('should have correct manifest structure', () => {
      const manifest = Addresses.manifest;

      expect(manifest.values).toBeDefined();
      expect(manifest.values.type).toBe('okapi');
      expect(manifest.values.path).toBe('settings/entries');
      expect(manifest.values.records).toBe('items');
      expect(manifest.values.GET.params.query).toBe('scope=ui-tenant-settings.addresses.manage');
      expect(manifest.values.GET.params.limit).toBe('500');
    });

    it('should have correct PUT and DELETE paths', () => {
      const manifest = Addresses.manifest;

      expect(manifest.values.PUT.path).toBe('settings/entries/%{activeRecord.id}');
      expect(manifest.values.DELETE.path).toBe('settings/entries/%{activeRecord.id}');
    });

    it('should have updaters configuration', () => {
      const manifest = Addresses.manifest;

      expect(manifest.updaters).toBeDefined();
      expect(manifest.updaters.type).toBe('okapi');
      expect(manifest.updaters.path).toBe('users');
      expect(manifest.updaters.records).toBe('users');
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

