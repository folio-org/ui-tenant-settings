import { getInitialValues } from './localeHelpers';

describe('Locale helpers', () => {
  describe('getInitialValues', () => {
    describe('when there are settings', () => {
      it('should merge input settings with default settings', () => {
        const settings = {
          locale: 'en-GB',
          numberingSystem: 'arab',
        };

        expect(getInitialValues(settings)).toEqual({
          locale: 'en-GB',
          numberingSystem: 'arab',
          timezone: 'UTC',
          currency: 'USD',
        });
      });
    });

    describe('when there are no settings', () => {
      it('should return default settings', () => {
        const settings = {};

        expect(getInitialValues(settings)).toEqual({
          locale: 'en-US',
          numberingSystem: 'latn',
          timezone: 'UTC',
          currency: 'USD',
        });
      });
    });
  });
});
