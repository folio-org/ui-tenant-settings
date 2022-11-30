import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mocks__';
import buildStripes from '../../../test/jest/__new_mocks__/stripesCore.mock';
import {
  renderWithRouter, renderWithReduxForm
} from '../../../test/jest/helpers';

import ServicePointDetail from './ServicePointDetail';
import { initialValuesMock, servicePointsMock, parentMutatorMock, parentResourcesMock } from './test/setup';

const STRIPES = buildStripes();

const renderServicePointDetail = (props) => {
  const component = () => (
    <ServicePointDetail
      parentResources={parentResourcesMock}
      initialValues={initialValuesMock}
      stripes={STRIPES}
      parentMutator={parentMutatorMock}
      {...props}
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
    it('should render hold shelf expiration period', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[0] });
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.expirationPeriod')).toBeDefined();
    });

    it('should render Closed library date management for hold shelf expiration expiration date calculation', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[0] });
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement')).toBeDefined();
    });

    it('should render Closed library date management for hold shelf expiration expiration date calculation with value "Keep the original date"', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[0] });
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.KeepTheOriginalDate')).toBeDefined();
    });

    it('should render Closed library date management for hold shelf expiration expiration date calculation with value "Move to the end of the previous open day"', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[1] });
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.MoveToTheEndOfThePreviousOpenDay')).toBeDefined();
    });

    it('should render Closed library date management for hold shelf expiration expiration date calculation with value "Move to the end of the next open day"', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[2] });
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.MoveToTheEndOfTheNextOpenDay')).toBeDefined();
    });

    it('should render Closed library date management for hold shelf expiration expiration date calculation with value "Keep the original date/time"', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[3] });
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.KeepTheOriginalDateTime')).toBeDefined();
    });

    it('should render Closed library date management for hold shelf expiration expiration date calculation with value "Move to the end of the current service point hours"', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[4] });
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.MoveToTheEndOfTheCurrentServicePointHours')).toBeDefined();
    });

    it('should render Closed library date management for hold shelf expiration expiration date calculation with value "Move to the beginning of the next open service point hours"', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[5] });
      expect(screen.getByText('ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.MoveToTheBeginningOfTheNextOpenServicePointHours')).toBeDefined();
    });
  });

  describe('when pickupLocation is false', () => {
    it('should not render hold shelf expiration period', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[6] });
      expect(screen.queryByText('ui-tenant-settings.settings.servicePoint.expirationPeriod')).toBeNull();
    });

    it('should not render Closed library date management for hold shelf expiration expiration date calculation', () => {
      renderServicePointDetail({ initialValues : servicePointsMock[6] });
      expect(screen.queryByText('ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement')).toBeNull();
    });
  });
});
