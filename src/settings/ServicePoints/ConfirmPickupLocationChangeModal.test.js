import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import '../../../test/jest/__mocks__';

import ConfirmPickupLocationChangeModal from './ConfirmPickupLocationChangeModal';

const defaultProps = {
  open: true,
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};
const testIds = {
  confirmButton: 'confirmButton',
  cancelButton: 'cancelButton',
};
const messageIds = {
  title: 'ui-tenant-settings.settings.confirmPickupLocationChangeModal.title',
  message: 'ui-tenant-settings.settings.confirmPickupLocationChangeModal.message',
  buttonConfirm: 'ui-tenant-settings.settings.confirmPickupLocationChangeModal.button.confirm',
  buttonCancel: 'ui-tenant-settings.settings.confirmPickupLocationChangeModal.button.cancel',
};

describe('ConfirmPickupLocationChangeModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    render(
      <ConfirmPickupLocationChangeModal {...defaultProps} />
    );
  });

  it('should render with no axe errors', async () => {
    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render title', () => {
    expect(screen.getByText(messageIds.title)).toBeVisible();
  });

  it('should render message', () => {
    expect(screen.getByText(messageIds.message)).toBeVisible();
  });

  describe('Confirm button', () => {
    it('should render confirm button', () => {
      expect(screen.getByTestId(testIds.confirmButton)).toBeVisible();
    });

    it('should render confirm button text', () => {
      expect(screen.getByText(messageIds.buttonConfirm)).toBeVisible();
    });

    it('should call onConfirm', () => {
      fireEvent.click(screen.getByTestId(testIds.confirmButton));

      expect(defaultProps.onConfirm).toHaveBeenCalled();
    });
  });

  describe('Cancel button', () => {
    it('should render cancel button', () => {
      expect(screen.getByTestId(testIds.cancelButton)).toBeVisible();
    });

    it('should render cancel button text', () => {
      expect(screen.getByText(messageIds.buttonCancel)).toBeVisible();
    });

    it('should call onCancel', () => {
      fireEvent.click(screen.getByTestId(testIds.cancelButton));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
