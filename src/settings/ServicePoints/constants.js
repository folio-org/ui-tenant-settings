export const shortTermExpiryPeriod = ['Hours', 'Minutes'];
export const longTermExpiryPeriod = ['Months', 'Weeks', 'Days'];

export const closedLibraryDateManagementMapping = {
  Keep_the_current_due_date_time: 'KeepTheOriginalDateTime',
  Move_to_end_of_current_service_point_hours: 'MoveToTheEndOfTheCurrentServicePointHours',
  Move_to_beginning_of_next_open_service_point_hours: 'MoveToTheBeginningOfTheNextOpenServicePointHours',
  Keep_the_current_due_date : 'KeepTheOriginalDate',
  Move_to_the_end_of_the_previous_open_day: 'MoveToTheEndOfThePreviousOpenDay',
  Move_to_the_end_of_the_next_open_day: 'MoveToTheEndOfTheNextOpenDay',
};

export const shortTermClosedDateManagementMenu = [
  {
    label: 'KeepTheOriginalDateTime',
    value: 'Keep_the_current_due_date_time'
  },
  {
    label: 'MoveToTheEndOfTheCurrentServicePointHours',
    value: 'Move_to_end_of_current_service_point_hours'
  },
  {
    label: 'MoveToTheBeginningOfTheNextOpenServicePointHours',
    value: 'Move_to_beginning_of_next_open_service_point_hours'
  }
];

export const longTermClosedDateManagementMenu = [
  {
    label: 'KeepTheOriginalDate',
    value: 'Keep_the_current_due_date'
  },
  {
    label: 'MoveToTheEndOfThePreviousOpenDay',
    value: 'Move_to_the_end_of_the_previous_open_day'
  },
  {
    label: 'MoveToTheEndOfTheNextOpenDay',
    value: 'Move_to_the_end_of_the_next_open_day'
  }
];
