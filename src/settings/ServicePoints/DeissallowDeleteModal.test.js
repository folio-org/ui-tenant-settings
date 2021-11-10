import React from 'react';

import { screen, render } from '@testing-library/react';

import '../../../test/jest/__mocks__';

import DisallowDeleteModal from './DisallowDeleteModal';

const onCancelMock = jest.fn();

const renderDisallowDeleteModal = () => render(
  <DisallowDeleteModal
    onCancel={onCancelMock}
    open
  />
);

describe('RepeatableField', () => {
  it('should render RepeatableField label', () => {
    renderDisallowDeleteModal();

    expect(screen.getByText('ui-tenant-settings.settings.servicePoints.disallowDeleteServicePoint')).toBeVisible();
  });
});
