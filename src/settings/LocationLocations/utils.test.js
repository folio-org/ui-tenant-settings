import React from 'react';
import { FormattedMessage } from 'react-intl';

import { validate } from './utils';

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
