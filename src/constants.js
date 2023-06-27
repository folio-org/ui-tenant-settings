export const patronIdentifierTypes = [
  { key: 'barcode', label: 'Barcode' },
  { key: 'externalSystemId', label: 'External System ID' },
  { key: 'id', label: 'FOLIO Record Number' },
  { key: 'username', label: 'Username' },
  { key: 'personal.email', label: 'Email' },
];

export const samlBindingTypes = [
  { key: 'POST', label: 'POST binding' },
  { key: 'REDIRECT', label: 'Redirect binding' },
];

export const intervalPeriods = [
  {
    id: 1,
    label: 'ui-tenant-settings.settings.intervalPeriod.minutes',
    value: 'Minutes'
  },
  {
    id: 2,
    label: 'ui-tenant-settings.settings.intervalPeriod.hours',
    value: 'Hours'
  },
  {
    id: 3,
    label: 'ui-tenant-settings.settings.intervalPeriod.days',
    value: 'Days'
  },
  {
    id: 4,
    label: 'ui-tenant-settings.settings.intervalPeriod.weeks',
    value: 'Weeks'
  },
  {
    id: 5,
    label: 'ui-tenant-settings.settings.intervalPeriod.months',
    value: 'Months'
  },
];

export const SORT_TYPES = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
};

export const LOCATION_LIBRARY_ID_KEY = 'locationLibraryId';
export const LOCATION_CAMPUS_ID_KEY = 'locationCampusId';
export const LOCATION_INSTITUTION_ID_KEY = 'locationInstitutionId';

export const INSTITUTION_ID_LIBRARIES = 'institutionIdLibraries';
export const INSTITUTION_ID_CAMPUS = 'institutionIdCampuses';
export const CAMPUS_ID_LIBRARIES = 'campusIdLibraries';

export default '';

