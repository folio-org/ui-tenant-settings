export const shortTermExpiryPeriod = ['Hours', 'Minutes'];
export const longTermExpiryPeriod = ['Months', 'Weeks', 'Days'];

export const shortTermClosedDateManagementEnum = {
  KEEP_THE_CURRENT_DUE_DATE_TIME: 'Keep_the_current_due_date_time',
  MOVE_TO_END_OF_CURRENT_SERVICE_POINT_HOURS: 'Move_to_end_of_current_service_point_hours',
  MOVE_TO_BEGINNING_OF_NEXT_OPEN_SERVICE_POINT_HOURS: 'Move_to_beginning_of_next_open_service_point_hours'
};

export const longTermClosedDateManagementEnum = {
  KEEP_THE_CURRENT_DUE_DATE : 'Keep_the_current_due_date',
  MOVE_TO_THE_END_OF_THE_PREVIOUS_OPEN_DAY: 'Move_to_the_end_of_the_previous_open_day',
  MOVE_TO_THE_END_OF_THE_NEXT_OPEN_DAY: 'Move_to_the_end_of_the_next_open_day',
};

export const shortTermClosedDateManagementTranslations = [
  {
    label: 'ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.KeepTheOriginalDateTime',
    value: 'Keep_the_current_due_date_time'
  },
  {
    label: 'ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.MoveToTheEndOfTheCurrentServicePointHours',
    value: 'Move_to_end_of_current_service_point_hours'
  },
  {
    label: 'ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.MoveToTheBeginningOfTheNextOpenServicePointHours',
    value: 'Move_to_beginning_of_next_open_service_point_hours'
  }
];
export const longTermClosedDateManagementTranslations = [
  {
    label: 'ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.KeepTheOriginalDate',
    value: 'Keep_the_current_due_date'
  },
  {
    label: 'ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.MoveToTheEndOfThePreviousOpenDay',
    value: 'Move_to_the_end_of_the_previous_open_day'
  },
  {
    label: 'ui-tenant-settings.settings.servicePoint.closedLibraryDueDateManagement.MoveToTheEndOfTheNextOpenDay',
    value: 'Move_to_the_end_of_the_next_open_day'
  }
];