import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import '../../../test/jest/__new_mocks__/stripesCore.mock';
import {
  renderWithRouter, renderWithReduxForm
} from '../../../test/jest/helpers';

import ServicePointFormContainer from './ServicePointFormContainer';
import { initialValuesMock, parentMutatorMock, parentResourcesMock } from './test/setup';

const onSaveMock = jest.fn();

const renderServicePointFormContainer = () => {
  const component = () => (
    <ServicePointFormContainer
      onSave={onSaveMock}
      parentResources={parentResourcesMock}
      initialValues={initialValuesMock}
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

    userEvent.click(screen.getByRole('button', { name: /settings.general.saveAndClose/ }));
  });

  it('should render ServicePointFormContainer select with changed options', () => {
    renderServicePointFormContainer();

    userEvent.selectOptions(screen.getByRole('combobox', { name: /settings.servicePoints.pickupLocation/ }), 'true');

    expect(screen.getByRole('option', { name: /settings.servicePoints.pickupLocation.yes/ }).selected).toBe(true);
  });

  describe('when pick location is yes', () => {
    beforeEach(() => {
      renderServicePointFormContainer();
      userEvent.selectOptions(screen.getByRole('combobox', { name: /settings.servicePoints.pickupLocation/ }), 'true');
    });

    describe('when hold shelf expiry interval id is short term period Minutes', () => {
      beforeEach(() => {
        userEvent.selectOptions(screen.getAllByRole('combobox')[1], 'Days');
      });

      it('should render ServicePointFormContainer closed library date management select with changed options ', () => {
        userEvent.selectOptions(screen.getByRole('combobox', { name: /settings.servicePoints.closedLibraryDueDateManagement/ }), 'Move_to_the_end_of_the_previous_open_day');
        expect(screen.getByRole('option', { name: /settings.servicePoints.closedLibraryDueDateManagement.MoveToTheEndOfThePreviousOpenDay/ }).selected).toBe(true);
      });
    });
  });
});
