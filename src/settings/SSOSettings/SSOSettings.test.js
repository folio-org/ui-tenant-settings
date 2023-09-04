import React from 'react';
import { act, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SSOSettings from './SSOSettings';
import buildStripes from '../../../test/jest/__new_mocks__/stripesCore.mock';
import { renderWithRouter } from '../../../test/jest/helpers';


const hasPermMock = jest.fn().mockReturnValue(true);

const STRIPES = {
  ...buildStripes(),
  hasPerm: hasPermMock,
  config: {
    platform: 'tenant-settings'
  },
};

const resourcesMock = {
  values: {
    failed: false,
    hasLoaded: true,
    httpStatus: 200,
    isPending: false,
    module: '@folio/tenant-settings',
  },
};

const samlconfigCallback = jest.fn(() => Promise.resolve());
const urlValidatorCallback = jest.fn(() => Promise.resolve({ valid: true }));

const mutatorMock = {
  recordId: {
    replace: jest.fn(() => Promise.resolve()),
  },
  samlconfig: {
    PUT: samlconfigCallback,
  },
  downloadFile: {
    GET: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
  },
  urlValidator: {
    GET: urlValidatorCallback,
    reset: jest.fn(() => Promise.resolve()),
  }
};


const SSOSettingsLabel = 'SSOSettings label';

const renderSSOSettings = () => {
  renderWithRouter(
    <SSOSettings
      label={<h2>{SSOSettingsLabel}</h2>}
      stripes={STRIPES}
      resources={resourcesMock}
      mutator={mutatorMock}
    />
  );
};

describe('SSOSettings', () => {
  afterEach(() => {
    hasPermMock.mockClear();
  });

  it('should render SSOSettings label', () => {
    renderSSOSettings();

    const label = screen.getByText(SSOSettingsLabel);

    expect(label).toBeVisible();
  });

  it('save button should be disabled by default', () => {
    renderSSOSettings();

    const saveBtn = screen.getByRole('button', { name: 'stripes-core.button.save' });

    expect(saveBtn).toBeDisabled();
  });

  it('save button should not be disabled if Identity Provider Url Input is not empty', () => {
    renderSSOSettings();

    const identityProviderUrlInput = screen.getByLabelText(/ui-tenant-settings.settings.saml.idpUrl/i);
    const saveBtn = screen.getByRole('button', { name: 'stripes-core.button.save' });

    act(() => {
      fireEvent.change(identityProviderUrlInput, { target: { value: 'str' } });
    });

    expect(saveBtn).toBeEnabled();
  });

  describe('SSOSettings renders and call callbacks', () => {
    let identityProviderUrlInput;
    let samlBindingInput;
    let samlAttributeInput;
    let userPropertyInput;
    let downloadMetaBtn;
    let saveBtn;

    const setInputsAndButtons = () => {
      identityProviderUrlInput = screen.getByLabelText(/ui-tenant-settings.settings.saml.idpUrl/i);
      samlBindingInput = screen.getByLabelText(/ui-tenant-settings.settings.saml.binding/i);
      samlAttributeInput = screen.getByLabelText(/ui-tenant-settings.settings.saml.attribute/i);
      userPropertyInput = screen.getByLabelText(/ui-tenant-settings.settings.saml.userProperty/i);

      downloadMetaBtn = screen.getByRole('button', { name: 'ui-tenant-settings.settings.saml.downloadMetadata' });
      saveBtn = screen.queryByRole('button', { name: 'stripes-core.button.save' });
    };

    it('should render SSOSettings form elements', () => {
      renderSSOSettings();

      setInputsAndButtons();

      expect(identityProviderUrlInput).toBeVisible();
      expect(samlBindingInput).toBeVisible();
      expect(samlAttributeInput).toBeVisible();
      expect(userPropertyInput).toBeVisible();

      expect(downloadMetaBtn).toBeVisible();
      expect(saveBtn).toBeVisible();
    });

    it.skip('should call change and submit callbacks', async () => {
      renderSSOSettings();

      const changeSpy = jest.spyOn(SSOSettings.prototype, 'validateIdpUrl').mockImplementation(() => '');
      const submitSpy = jest.spyOn(SSOSettings.prototype, 'updateSettings');

      setInputsAndButtons();

      act(() => {
        fireEvent.change(identityProviderUrlInput, { target: { value: 'str' } });
        fireEvent.change(samlBindingInput, { target: { value: 'POST' } });
        fireEvent.change(samlAttributeInput, { target: { value: 'str' } });
        fireEvent.change(userPropertyInput, { target: { value: 'barcode' } });

        userEvent.click(saveBtn);
      });

      await waitFor(() => {
        userEvent.click(saveBtn);
      });

      expect(changeSpy).toHaveBeenCalled();
      expect(submitSpy).toHaveBeenCalled();
    });

    it('should render SSOSettings form elements "read-only mode"', async () => {
      hasPermMock.mockReturnValue(false);

      renderSSOSettings();

      setInputsAndButtons();

      expect(identityProviderUrlInput).toHaveAttribute('readonly');
      expect(samlAttributeInput).toHaveAttribute('readonly');
      expect(downloadMetaBtn).toBeVisible();
      expect(saveBtn).toBeNull();
    });
  });
});
