import React from 'react';
import { FormattedMessage } from 'react-intl';

import '../../test/jest/__mocks__';

import composeValidators from './composeValidators';
import locationCodeValidator from '../settings/locationCodeValidator';

describe('composeValidator', () => {
  it('should return error message', () => {
    expect(composeValidators(locationCodeValidator.validate)({ code: '' })).toEqual({ code: <FormattedMessage id="stripes-core.label.missingRequiredField" /> });
  });

  it('should return empty object', () => {
    expect(composeValidators(locationCodeValidator.validate)({ code: 'some value' })).toEqual({});
  });
});
