import React from 'react';
import user from '@testing-library/user-event';

import '../../../../test/jest/__mocks__';
import {
  renderWithRouter
} from '../../../../test/jest/helpers';

import { BursarExportsConfiguration } from './BursarExportsConfiguration';
import { SCHEDULE_PERIODS } from './constants';

const defaultProps = {
  onFormStateChanged: jest.fn(),
  onSubmit: jest.fn(),
  patronGroups: [{
    id: 'groupId',
    group: 'group',
  }],
  initialValues: {
    schedulePeriod: SCHEDULE_PERIODS.none,
  }
};

const renderBursarExportsConfiguration = (props = {}) => renderWithRouter(
  <BursarExportsConfiguration {...defaultProps} {...props} />
);

describe('BursarExportsConfiguration', () => {
  it('should render schedule period field', () => {
    const { getByText } = renderBursarExportsConfiguration();

    expect(getByText('ui-tenant-settings.settings.bursarExports.schedulePeriod')).toBeDefined();
  });

  it('should render ftp address field', () => {
    const { getByText } = renderBursarExportsConfiguration();

    expect(getByText('ui-tenant-settings.settings.bursarExports.ftpAddress')).toBeDefined();
  });

  describe('None period', () => {
    it('should not render job parameter fields', () => {
      const { queryByText } = renderBursarExportsConfiguration();

      expect(queryByText('ui-tenant-settings.settings.bursarExports.daysOutstanding')).toBeNull();
      expect(queryByText('ui-tenant-settings.settings.bursarExports.patronGroups')).toBeNull();
    });

    it('should should define schedule frequency when period is changed from None', () => {
      const { getByTestId } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.none,
        }
      });

      user.selectOptions(getByTestId('schedule-period'), SCHEDULE_PERIODS.days);

      const schedulePeriodField = getByTestId('schedule-frequency');

      expect(schedulePeriodField).toBeDefined();
      expect(schedulePeriodField.value).toBeDefined();
    });

    it('should reset scheduleFrequency when period is changed to None', () => {
      const { queryByTestId, getByTestId } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.days,
        }
      });

      user.selectOptions(getByTestId('schedule-period'), SCHEDULE_PERIODS.none);

      expect(queryByTestId('schedule-frequency')).toBeNull();
    });

    it('should reset scheduleTime when period is changed to None', () => {
      const { queryByText, getByTestId } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.days,
        }
      });

      user.selectOptions(getByTestId('schedule-period'), SCHEDULE_PERIODS.none);

      expect(queryByText('ui-tenant-settings.settings.bursarExports.scheduleTime')).toBeNull();
    });
  });

  describe('Hours period', () => {
    it('should should display frequency field', () => {
      const { queryByText, queryByTestId } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.hours,
        }
      });

      expect(queryByTestId('schedule-frequency')).not.toBeNull();
      expect(queryByText('ui-tenant-settings.settings.bursarExports.scheduleTime')).toBeNull();
      expect(queryByText('ui-tenant-settings.settings.bursarExports.scheduleWeekdays')).toBeNull();
    });

    it('should not render job parameter fields', () => {
      const { queryByText } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.hours,
        }
      });

      expect(queryByText('ui-tenant-settings.settings.bursarExports.daysOutstanding')).not.toBeNull();
      expect(queryByText('ui-tenant-settings.settings.bursarExports.patronGroups')).not.toBeNull();
    });

    it('should reset scheduleTime when period is changed to Hours', () => {
      const { queryByText, getByTestId } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.days,
        }
      });

      user.selectOptions(getByTestId('schedule-period'), SCHEDULE_PERIODS.hours);

      expect(queryByText('ui-tenant-settings.settings.bursarExports.scheduleTime')).toBeNull();
    });
  });

  describe('Days period', () => {
    it('should should display frequency and time fields', () => {
      const { queryByText, queryByTestId } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.days,
          patronGroups: [],
        }
      });

      expect(queryByTestId('schedule-frequency')).not.toBeNull();
      expect(queryByText('ui-tenant-settings.settings.bursarExports.scheduleTime')).not.toBeNull();
      expect(queryByText('ui-tenant-settings.settings.bursarExports.scheduleWeekdays')).toBeNull();
    });
  });

  it('should not render job parameter fields', () => {
    const { queryByText } = renderBursarExportsConfiguration({
      initialValues: {
        schedulePeriod: SCHEDULE_PERIODS.days,
      }
    });

    expect(queryByText('ui-tenant-settings.settings.bursarExports.daysOutstanding')).not.toBeNull();
    expect(queryByText('ui-tenant-settings.settings.bursarExports.patronGroups')).not.toBeNull();
  });

  describe('Weeks period', () => {
    it('should should display frequency, time and weekdays fields', () => {
      const { queryByText, queryByTestId } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.weeks,
          weekDays: {
            'day': false,
          },
        }
      });

      expect(queryByTestId('schedule-frequency')).not.toBeNull();
      expect(queryByText('ui-tenant-settings.settings.bursarExports.scheduleTime')).not.toBeNull();
      expect(queryByText('ui-tenant-settings.settings.bursarExports.scheduleWeekdays')).not.toBeNull();
    });

    it('should not render job parameter fields', () => {
      const { queryByText } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.weeks,
        }
      });

      expect(queryByText('ui-tenant-settings.settings.bursarExports.daysOutstanding')).not.toBeNull();
      expect(queryByText('ui-tenant-settings.settings.bursarExports.patronGroups')).not.toBeNull();
    });

    it('should reset scheduleWeekdays when period is changed to any periods', () => {
      const { queryByText, getByTestId } = renderBursarExportsConfiguration({
        initialValues: {
          schedulePeriod: SCHEDULE_PERIODS.weeks,
        }
      });

      user.selectOptions(getByTestId('schedule-period'), SCHEDULE_PERIODS.hours);

      expect(queryByText('ui-tenant-settings.settings.bursarExports.scheduleWeekdays')).toBeNull();
    });
  });
});
