import { FormattedMessage } from 'react-intl';

import vocabularyUniquenessValidator from './vocabularyUniquenessValidator';

describe('vocabularyUniquenessValidator', () => {
  const fields = ['name', 'code'];
  const translationIdsDict = {
    name: 'ui-tenant-settings.settings.location.institutions.name.error',
    code: 'ui-tenant-settings.settings.location.institutions.code.error',
  };

  it('should return undefined when no duplicates exist', () => {
    const validator = vocabularyUniquenessValidator(fields, translationIdsDict);
    const items = [
      { name: 'Item 1', code: 'CODE1' },
      { name: 'Item 2', code: 'CODE2' },
    ];

    const result = validator.validate(items[0], 0, items);

    expect(result).toBeUndefined();
  });

  it('should return error for duplicate name', () => {
    const validator = vocabularyUniquenessValidator(fields, translationIdsDict);
    const items = [
      { name: 'Item 1', code: 'CODE1' },
      { name: 'Item 1', code: 'CODE2' },
    ];

    const result = validator.validate(items[1], 1, items);

    expect(result).toBeDefined();
    expect(result.name).toEqual(<FormattedMessage id={translationIdsDict.name} />);
  });

  it('should return error for duplicate code', () => {
    const validator = vocabularyUniquenessValidator(fields, translationIdsDict);
    const items = [
      { name: 'Item 1', code: 'CODE1' },
      { name: 'Item 2', code: 'CODE1' },
    ];

    const result = validator.validate(items[1], 1, items);

    expect(result).toBeDefined();
    expect(result.code).toEqual(<FormattedMessage id={translationIdsDict.code} />);
  });

  it('should be case insensitive', () => {
    const validator = vocabularyUniquenessValidator(fields, translationIdsDict);
    const items = [
      { name: 'Item 1', code: 'CODE1' },
      { name: 'ITEM 1', code: 'code1' },
    ];

    const result = validator.validate(items[1], 1, items);

    expect(result).toBeDefined();
    expect(result.name).toEqual(<FormattedMessage id={translationIdsDict.name} />);
    expect(result.code).toEqual(<FormattedMessage id={translationIdsDict.code} />);
  });

  it('should not compare item with itself', () => {
    const validator = vocabularyUniquenessValidator(fields, translationIdsDict);
    const items = [
      { name: 'Item 1', code: 'CODE1' },
    ];

    const result = validator.validate(items[0], 0, items);

    expect(result).toBeUndefined();
  });

  it('should handle empty fields array', () => {
    const validator = vocabularyUniquenessValidator([], translationIdsDict);
    const items = [
      { name: 'Item 1', code: 'CODE1' },
      { name: 'Item 1', code: 'CODE1' },
    ];

    const result = validator.validate(items[1], 1, items);

    expect(result).toBeUndefined();
  });

  it('should handle undefined fields', () => {
    const validator = vocabularyUniquenessValidator(undefined, translationIdsDict);
    const items = [
      { name: 'Item 1', code: 'CODE1' },
      { name: 'Item 1', code: 'CODE1' },
    ];

    const result = validator.validate(items[1], 1, items);

    expect(result).toBeUndefined();
  });

  it('should memoize validator instances', () => {
    const validator1 = vocabularyUniquenessValidator(fields, translationIdsDict);
    const validator2 = vocabularyUniquenessValidator(fields, translationIdsDict);

    expect(validator1).toBe(validator2);
  });
});
