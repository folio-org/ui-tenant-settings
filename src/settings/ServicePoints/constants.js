export const shortTermExpiryPeriod = ['Hours', 'Minutes'];
export const longTermExpiryPeriod = ['Months', 'Weeks', 'Days'];

export const closedLibraryDateManagementMapping = {
  Keep_the_current_due_date_time: 'keepTheOriginalDateTime',
  Move_to_end_of_current_service_point_hours: 'moveToTheEndOfTheCurrentServicePointHours',
  Move_to_beginning_of_next_open_service_point_hours: 'MoveToTheBeginningOfTheNextOpenServicePointHours',
  Keep_the_current_due_date : 'keepTheOriginalDate',
  Move_to_the_end_of_the_previous_open_day: 'moveToTheEndOfThePreviousOpenDay',
  Move_to_the_end_of_the_next_open_day: 'moveToTheEndOfTheNextOpenDay',
};

export const shortTermClosedDateManagementMenu = [
  {
    label: 'keepTheOriginalDateTime',
    value: 'Keep_the_current_due_date_time'
  },
  {
    label: 'moveToTheEndOfTheCurrentServicePointHours',
    value: 'Move_to_end_of_current_service_point_hours'
  },
  {
    label: 'MoveToTheBeginningOfTheNextOpenServicePointHours',
    value: 'Move_to_beginning_of_next_open_service_point_hours'
  }
];

export const longTermClosedDateManagementMenu = [
  {
    label: 'keepTheOriginalDate',
    value: 'Keep_the_current_due_date'
  },
  {
    label: 'moveToTheEndOfThePreviousOpenDay',
    value: 'Move_to_the_end_of_the_previous_open_day'
  },
  {
    label: 'moveToTheEndOfTheNextOpenDay',
    value: 'Move_to_the_end_of_the_next_open_day'
  }
];
