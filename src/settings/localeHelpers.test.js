import { parseSerializedLocale, serializeLocale } from './localeHelpers';

describe('Locale helpers', () => {
  it('parseSerializedLocale should parse a locale value', () => {
    const raw = [{ 'value': '{"locale":"en-GB","timezone":"UTC","currency":"USD"}' }];
    const cooked = { 'locale':'en-GB', 'timezone':'UTC', 'currency':'USD' };

    expect(parseSerializedLocale(raw)).toMatchObject(cooked);
  });

  it('parseSerializedLocale should parse a locale value with numbering system', () => {
    const raw = [{ 'value': '{"locale":"en-GB-u-nu-arab","timezone":"UTC","currency":"USD"}' }];
    const cooked = { 'locale': 'en-GB', 'timezone': 'UTC', 'currency': 'USD', 'numberingSystem': 'arab' };

    expect(parseSerializedLocale(raw)).toMatchObject(cooked);
  });

  it('serializeLocale should return a locale', () => {
    const raw = { 'locale': 'en-GB', 'timezone': 'UTC', 'currency': 'USD' };
    expect(serializeLocale(raw)).toEqual(JSON.stringify(raw));
  });

  it('serializeLocale should concatenate numbering system onto locale', () => {
    const raw = { 'locale': 'en-GB', 'numberingSystem': 'arab', 'timezone': 'UTC', 'currency': 'USD' };
    const cooked = '{"locale":"en-GB-u-nu-arab","timezone":"UTC","currency":"USD"}';

    expect(serializeLocale(raw)).toEqual(cooked);
  });
});
