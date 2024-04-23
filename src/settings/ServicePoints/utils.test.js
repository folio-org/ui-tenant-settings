import {
  isEcsRequestRoutingVisible,
  isEcsRequestRoutingAssociatedFieldsVisible,
} from './utils';

describe('isEcsRequestRoutingVisible', () => {
  it('should return true when both interfaces present', () => {
    const stripes = {
      hasInterface: (currentInterface) => {
        const interfaces = {
          consortia: true,
          'ecs-tlr': true,
        };

        return interfaces[currentInterface];
      },
    };

    expect(isEcsRequestRoutingVisible(stripes)).toBe(true);
  });

  it('should return false when ecs-tlr interface absent', () => {
    const stripes = {
      hasInterface: (currentInterface) => {
        const interfaces = {
          consortia: true,
          'ecs-tlr': false,
        };

        return interfaces[currentInterface];
      },
    };

    expect(isEcsRequestRoutingVisible(stripes)).toBe(false);
  });

  it('should return false when consortia interface absent', () => {
    const stripes = {
      hasInterface: (currentInterface) => {
        const interfaces = {
          consortia: false,
          'ecs-tlr': true,
        };

        return interfaces[currentInterface];
      },
    };

    expect(isEcsRequestRoutingVisible(stripes)).toBe(false);
  });

  it('should return false when both interfaces absent', () => {
    const stripes = {
      hasInterface: (currentInterface) => {
        const interfaces = {
          consortia: false,
          'ecs-tlr': false,
        };

        return interfaces[currentInterface];
      },
    };

    expect(isEcsRequestRoutingVisible(stripes)).toBe(false);
  });
});

describe('isEcsRequestRoutingAssociatedFieldsVisible', () => {
  it('should return false when both condition true', () => {
    const stripes = {
      hasInterface: (currentInterface) => {
        const interfaces = {
          consortia: true,
          'ecs-tlr': true,
        };

        return interfaces[currentInterface];
      },
    };

    expect(isEcsRequestRoutingAssociatedFieldsVisible(stripes, true)).toBe(false);
  });

  it('should return true when first condition false', () => {
    const stripes = {
      hasInterface: (currentInterface) => {
        const interfaces = {
          consortia: false,
          'ecs-tlr': false,
        };

        return interfaces[currentInterface];
      },
    };

    expect(isEcsRequestRoutingAssociatedFieldsVisible(stripes, true)).toBe(true);
  });

  it('should return true when second condition false', () => {
    const stripes = {
      hasInterface: (currentInterface) => {
        const interfaces = {
          consortia: true,
          'ecs-tlr': true,
        };

        return interfaces[currentInterface];
      },
    };

    expect(isEcsRequestRoutingAssociatedFieldsVisible(stripes, false)).toBe(true);
  });

  it('should return true when both condition false', () => {
    const stripes = {
      hasInterface: (currentInterface) => {
        const interfaces = {
          consortia: false,
          'ecs-tlr': false,
        };

        return interfaces[currentInterface];
      },
    };

    expect(isEcsRequestRoutingAssociatedFieldsVisible(stripes, false)).toBe(true);
  });
});
