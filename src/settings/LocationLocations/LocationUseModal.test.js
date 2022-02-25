import React from 'react';
import { screen, render } from '@testing-library/react';

import '../../../test/jest/__mocks__';

import userEvent from '@testing-library/user-event';
import LocationInUseModal from './LocationInUseModal';

const toggleModalMock = jest.fn();

const renderLocationInUseModal = () => render(
  <LocationInUseModal
    toggleModal={toggleModalMock}
  />
);

describe('LocationInUseModal', () => {
  it('should render LocationInUseModal', () => {
    renderLocationInUseModal();

    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('should call toggleModal callback', () => {
    renderLocationInUseModal();

    userEvent.click(screen.getByRole('button', { name: 'stripes-core.label.okay' }));

    expect(toggleModalMock).toHaveBeenCalled();
  });
});
