import {
  isEcsRequestRoutingVisible,
  isEcsRequestRoutingAssociatedFieldsVisible,
  getEcsTlrFeature,
} from './utils';

describe('isEcsRequestRoutingVisible', () => {
  it('should return true when titleLevelRequestsFeatureEnabled true', () => {
    expect(isEcsRequestRoutingVisible(true)).toBe(true);
  });

  it('should return false when titleLevelRequestsFeatureEnabled false', () => {
    expect(isEcsRequestRoutingVisible(false)).toBe(false);
  });

  it('should return false when titleLevelRequestsFeatureEnabled absent', () => {
    expect(isEcsRequestRoutingVisible(undefined)).toBe(false);
  });
});

describe('isEcsRequestRoutingAssociatedFieldsVisible', () => {
  it('should return false when both condition true', () => {
    expect(isEcsRequestRoutingAssociatedFieldsVisible(true, true)).toBe(false);
  });

  it('should return true when first condition false', () => {
    expect(isEcsRequestRoutingAssociatedFieldsVisible(false, true)).toBe(true);
  });

  it('should return true when second condition false', () => {
    expect(isEcsRequestRoutingAssociatedFieldsVisible(true, false)).toBe(true);
  });

  it('should return true when both condition false', () => {
    expect(isEcsRequestRoutingAssociatedFieldsVisible(false, false)).toBe(true);
  });
});

describe('getEcsTlrFeature', () => {
  it('should return true when ecsTlrFeature true', () => {
    const data = [{
      value: {
        enabled: true,
      },
    }];

    expect(getEcsTlrFeature(data)).toBe(true);
  });

  it('should return false when ecsTlrFeature false', () => {
    const data = [{
      value: {
        enabled: false,
      },
    }];

    expect(getEcsTlrFeature(data)).toBe(false);
  });

  it('should return false when ecsTlrFeature absent', () => {
    expect(getEcsTlrFeature(undefined)).toBe(false);
  });
});
