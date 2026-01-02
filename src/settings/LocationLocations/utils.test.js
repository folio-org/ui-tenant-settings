import React from 'react';
import { FormattedMessage } from 'react-intl';

import { validate, getUniquenessValidation } from './utils';

const initialValuesMockWithResources = {
  campusId: '',
  detailsArray: [
    { value:{
      props: {
        id: 'stripes-core.label.missingRequiredField'
      },
      key: null
    } },
  ],
  institutionId: '',
  isActive: true,
  libraryId: '',
  servicePointIds:[
    {
      primary: true,
      selectSP: ''
    }
  ]
};

const initialValuesMock1WithoutResources = {
  campusId: '',
  detailsArray: [
  ],
  institutionId: '',
  isActive: true,
  libraryId: '',
  servicePointIds:[
  ]
};

const equelValue = {
  institutionId:<FormattedMessage id="stripes-core.label.missingRequiredField" />,
  campusId:<FormattedMessage id="stripes-core.label.missingRequiredField" />,
  detailsArray: [{
    name: <FormattedMessage id="stripes-core.label.missingRequiredField" />,
  }],
  code:<FormattedMessage id="stripes-core.label.missingRequiredField" />,
  discoveryDisplayName:<FormattedMessage id="stripes-core.label.missingRequiredField" />,
  libraryId: <FormattedMessage id="stripes-core.label.missingRequiredField" />,
  name:<FormattedMessage id="stripes-core.label.missingRequiredField" />,
  servicePointIds:  [
    {
      selectSP: <FormattedMessage id="stripes-core.label.missingRequiredField" />
    },
  ],
};

const equelValueEmpty = {
  institutionId:<FormattedMessage id="stripes-core.label.missingRequiredField" />,
  campusId:<FormattedMessage id="stripes-core.label.missingRequiredField" />,

  code:<FormattedMessage id="stripes-core.label.missingRequiredField" />,
  discoveryDisplayName:<FormattedMessage id="stripes-core.label.missingRequiredField" />,
  libraryId: <FormattedMessage id="stripes-core.label.missingRequiredField" />,
  name:<FormattedMessage id="stripes-core.label.missingRequiredField" />,
  servicePointIds:  {
    _error: 'At least one Service Point must be entered',
  },
};
describe('utils', () => {
  it('should return equelValueMock', () => {
    expect(validate(initialValuesMockWithResources)).toEqual(equelValue);
  });

  it('should return equelValueEmpty', () => {
    expect(validate(initialValuesMock1WithoutResources)).toEqual(equelValueEmpty);
  });
});

describe('getUniquenessValidation', () => {
  const field = 'name';
  const mockKy = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve immediately when value is empty', async () => {
    const validator = getUniquenessValidation(field, mockKy);
    const result = await validator('', {}, { dirty: false });

    expect(result).toBeUndefined();
    expect(mockKy.get).not.toHaveBeenCalled();
  });

  it('should resolve immediately when id is present and field is not dirty', async () => {
    const id = '184aae84-a5bf-4c6a-85ba-4a7c73026cd5';
    const validator = getUniquenessValidation(field, mockKy, id);
    const result = await validator('Test Location', {}, { dirty: false });

    expect(result).toBeUndefined();
    expect(mockKy.get).not.toHaveBeenCalled();
  });

  it('should make API call without id filter when creating new location', async () => {
    mockKy.get.mockReturnValue({
      json: () => Promise.resolve({ locations: [] }),
    });

    const validator = getUniquenessValidation(field, mockKy);
    const result = await validator('Test Location', {}, { dirty: true });

    expect(result).toBeUndefined();
    expect(mockKy.get).toHaveBeenCalledWith('locations', {
      searchParams: { query: '(name=="Test Location")' },
    });
  });

  it('should make API call with id filter when editing existing location', async () => {
    const id = '184aae84-a5bf-4c6a-85ba-4a7c73026cd5';
    mockKy.get.mockReturnValue({
      json: () => Promise.resolve({ locations: [] }),
    });

    const validator = getUniquenessValidation(field, mockKy, id);
    const result = await validator('Test Location', {}, { dirty: true });

    expect(result).toBeUndefined();
    expect(mockKy.get).toHaveBeenCalledWith('locations', {
      searchParams: { query: `(name=="Test Location") AND id<>"${id}"` },
    });
  });

  it('should escape special CQL characters in value', async () => {
    mockKy.get.mockReturnValue({
      json: () => Promise.resolve({ locations: [] }),
    });

    const validator = getUniquenessValidation(field, mockKy);
    await validator('Test "Location" a*b?c\\d^e', {}, { dirty: true });

    expect(mockKy.get).toHaveBeenCalledWith('locations', {
      searchParams: { query: '(name=="Test \\"Location\\" a\\*b\\?c\\\\d\\^e")' },
    });
  });

  it('should return error message when location already exists', async () => {
    mockKy.get.mockReturnValue({
      json: () => Promise.resolve({ locations: [{ id: 'existing-id' }] }),
    });

    const validator = getUniquenessValidation(field, mockKy);
    const result = await validator('Existing Location', {}, { dirty: true });

    expect(result).toEqual(<FormattedMessage id="ui-tenant-settings.settings.location.locations.validation.name.unique" />);
  });

  it('should return undefined when no duplicate locations found', async () => {
    mockKy.get.mockReturnValue({
      json: () => Promise.resolve({ locations: [] }),
    });

    const validator = getUniquenessValidation(field, mockKy);
    const result = await validator('Unique Location', {}, { dirty: true });

    expect(result).toBeUndefined();
  });

  it('should return error message when API call fails', async () => {
    mockKy.get.mockReturnValue({
      json: () => Promise.reject(new Error('Network error')),
    });

    const validator = getUniquenessValidation(field, mockKy);
    const result = await validator('Test Location', {}, { dirty: true });

    expect(result).toEqual(<FormattedMessage id="ui-tenant-settings.settings.location.locations.validation.name.unique" />);
  });
});
