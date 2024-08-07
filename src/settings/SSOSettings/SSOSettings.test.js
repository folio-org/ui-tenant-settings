import React from 'react';
import { act, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';

import SSOSettings from './SSOSettings';
import { renderWithRouter } from '../../../test/jest/helpers';

import '../../../test/jest/__mocks__';
import { mockHasPerm } from '../../../test/jest/__mocks__/stripesCore.mock';

const SSOSettingsLabel = 'SSOSettings label';

const renderSSOSettings = () => {
  renderWithRouter(
    <QueryClientProvider client={new QueryClient()}>
      <SSOSettings
        label={<h2>{SSOSettingsLabel}</h2>}
      />
    </QueryClientProvider>
  );
};

describe('SSOSettings', () => {
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
      mockHasPerm.mockReturnValue(false);

      renderSSOSettings();

      setInputsAndButtons();

      expect(identityProviderUrlInput).toBeDisabled();
      expect(samlAttributeInput).toBeDisabled();
      expect(downloadMetaBtn).toBeVisible();
      expect(saveBtn).toBeNull();
    });
  });
});
