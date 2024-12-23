import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import '../../../test/jest/__new_mocks__/stripesCore.mock';
import {
  renderWithRouter, renderWithReduxForm
} from '../../../test/jest/helpers';

import ServicePointFormContainer from './ServicePointFormContainer';
import { parentMutatorMock, parentResourcesMock } from './test/setup';

jest.mock('../../hooks', () => ({
  useCirculationSettingsEcsTlrFeature: jest.fn().mockReturnValue({ titleLevelRequestsFeatureEnabled: true }),
}));

const onSave = jest.fn();
const staffSlips = [true, true, true, true];

const renderServicePointFormContainer = () => {
  const component = () => (
    <ServicePointFormContainer
      onSave={onSave}
      parentResources={parentResourcesMock}
      initialValues={{ staffSlips }}
      parentMutator={parentMutatorMock}
    />
  );

  return renderWithRouter(renderWithReduxForm(component));
};

describe('ServicePointFormContainer', () => {
  it('should render ServicePointFormContainer titles', () => {
    renderServicePointFormContainer();

    expect(screen.getByRole('heading', { name: /settings.servicePoints.new/ })).toBeVisible();
  });

  it('should render ServicePointFormContainer regions', () => {
    renderServicePointFormContainer();

    const regions = [
      'Icon ui-tenant-settings.settings.servicePoints.generalInformation',
      'Icon ui-tenant-settings.settings.servicePoints.assignedLocations',
    ];

    regions.forEach((el) => expect(screen.getByRole('region', { name: el })).toBeVisible());
  });

  it('should render ServicePointFormContainer with expanded content', () => {
    renderServicePointFormContainer();

    const regions = [
      'Icon ui-tenant-settings.settings.servicePoints.generalInformation',
      'Icon ui-tenant-settings.settings.servicePoints.assignedLocations',
    ];

    regions.forEach((el) => userEvent.click(screen.getByRole('button', { name: el })));

    regions.forEach((el) => expect(screen.getByRole('region', { name: el })).toHaveAttribute('class', 'content-region'));

    userEvent.click(screen.getByRole('button', { name: 'stripes-components.expandAll' }));

    regions.forEach((el) => expect(screen.getByRole('region', { name: el })).toHaveAttribute('class', 'content-region expanded'));
  });

  it('should render ServicePointFormContainer textboxes', () => {
    renderServicePointFormContainer();

    const textboxes = [
      /settings.servicePoints.name/,
      /settings.servicePoints.code/,
      /settings.servicePoints.discoveryDisplayName/,
      /settings.servicePoints.description/,
      /settings.servicePoints.shelvingLagTime/,
    ];

    textboxes.forEach((el) => userEvent.type(screen.getByRole('textbox', { name: el }), 'new value'));

    textboxes.forEach((el) => expect(screen.getByRole('textbox', { name: el })).toHaveValue('new value'));

    userEvent.click(screen.getByRole('button', { name: /saveAndClose/ }));
  });

  it('should render ServicePointFormContainer select with changed options', () => {
    renderServicePointFormContainer();

    userEvent.selectOptions(screen.getByRole('combobox', { name: /settings.servicePoints.pickupLocation/ }), 'true');

    expect(screen.getAllByRole('option', { name: /settings.servicePoints.value.yes/ })[1].selected).toBe(true);
  });

  describe('ecs request routing', () => {
    beforeEach(() => {
      renderServicePointFormContainer();
    });

    it('should not render pick location', () => {
      userEvent.selectOptions(screen.getByRole('combobox', { name: /settings.servicePoints.ecsRequestRouting/ }), 'true');

      expect(screen.queryByText(/settings.servicePoints.pickupLocation/)).not.toBeInTheDocument();
    });

    it('should not render pick location', () => {
      userEvent.selectOptions(screen.getByRole('combobox', { name: /settings.servicePoints.ecsRequestRouting/ }), 'false');

      expect(screen.queryByText(/settings.servicePoints.pickupLocation/)).toBeInTheDocument();
    });
  });

  describe('when pick location is yes', () => {
    beforeEach(() => {
      renderServicePointFormContainer();
      userEvent.selectOptions(screen.getByRole('combobox', { name: /settings.servicePoints.pickupLocation/ }), 'true');
    });

    describe('when hold shelf expiry interval id is short term period Days', () => {
      beforeEach(() => {
        userEvent.selectOptions(screen.getAllByRole('combobox')[2], 'Days');
      });

      it('should render ServicePointFormContainer closed library date management select with changed options ', () => {
        userEvent.selectOptions(screen.getByRole('combobox', { name: /settings.servicePoints.holdShelfClosedLibraryDateManagement/ }), 'Move_to_the_end_of_the_previous_open_day');
        expect(screen.getByRole('option', { name: /settings.servicePoints.holdShelfClosedLibraryDateManagement.moveToTheEndOfThePreviousOpenDay/ }).selected).toBe(true);
      });
    });
  });
});
