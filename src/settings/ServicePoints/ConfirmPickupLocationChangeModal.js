import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const ConfirmPickupLocationChangeModal = ({
  open,
  onConfirm,
  onCancel,
}) => {
  const footer = (
    <ModalFooter>
      <Button
        data-testid="confirmButton"
        buttonStyle="primary"
        autoFocus
        onClick={onConfirm}
      >
        <FormattedMessage id="ui-tenant-settings.settings.confirmPickupLocationChangeModal.button.confirm" />
      </Button>
      <Button
        data-testid="cancelButton"
        onClick={onCancel}
      >
        <FormattedMessage id="ui-tenant-settings.settings.confirmPickupLocationChangeModal.button.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      label={<FormattedMessage id="ui-tenant-settings.settings.confirmPickupLocationChangeModal.title" />}
      open={open}
      size="small"
      footer={footer}
    >
      <FormattedMessage id="ui-tenant-settings.settings.confirmPickupLocationChangeModal.message" />
    </Modal>
  );
};

ConfirmPickupLocationChangeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmPickupLocationChangeModal;
