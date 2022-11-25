import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import buildStripes from '../../../test/jest/__new_mocks__/stripesCore.mock';
import {
  renderWithRouter, renderWithReduxForm
} from '../../../test/jest/helpers';

import ServicePointDetail from './ServicePointDetail';
import { servicePointsMock, parentMutatorMock, parentResourcesMock } from './test/setup';

const STRIPES = buildStripes();

const renderServicePointDetail = () => {
  const component = () => (
    <ServicePointDetail
      parentResources={parentResourcesMock}
      initialValues={servicePointsMock}
      stripes={STRIPES}
      parentMutator={parentMutatorMock}
    />
  );

  return renderWithRouter(renderWithReduxForm(component));
};

describe('ServicePointDetail', () => {
  it('should render ServicePointDetail regions', () => {
    renderServicePointDetail();

    const regions = [
      'Icon ui-tenant-settings.settings.servicePoints.generalInformation',
      'Icon ui-tenant-settings.settings.servicePoints.assignedLocations',
    ];

    regions.forEach((el) => expect(screen.getByRole('region', { name: el })).toBeVisible());
  });

  it('should render ServicePointDetail with expanded content', () => {
    renderServicePointDetail();

    const regions = [
      'Icon ui-tenant-settings.settings.servicePoints.generalInformation',
      'Icon ui-tenant-settings.settings.servicePoints.assignedLocations',
    ];

    regions.forEach((el) => userEvent.click(screen.getByRole('button', { name: el })));

    regions.forEach((el) => expect(screen.getByRole('region', { name: el })).toHaveAttribute('class', 'content-region'));

    userEvent.click(screen.getByRole('button', { name: 'stripes-components.expandAll' }));

    regions.forEach((el) => expect(screen.getByRole('region', { name: el })).toHaveAttribute('class', 'content-region expanded'));
  });

  describe('when pickupLocation is true', () => {
    it('should render hold shelf expiration', () => {
      renderServicePointDetail();
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.expirationPeriod')).toBeDefined();
    });

    it('should render closed library date management', () => {
      renderServicePointDetail();
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement')).toBeDefined();
    });
  });
});
