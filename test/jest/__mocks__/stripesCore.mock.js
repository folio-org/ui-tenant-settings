export const mockHasPerm = jest.fn(() => true);
export const mockHasInterface = jest.fn().mockReturnValue(true);
export const mockUseOkapiKy = jest.fn();

let STRIPES;

export const stripesConnect = Component => ({ mutator, resources, stripes, ...rest }) => {
  const fakeMutator = mutator || Object.keys(Component.manifest).reduce((acc, mutatorName) => {
    const returnValue = Component.manifest[mutatorName].records ? [] : {};

    acc[mutatorName] = {
      GET: jest.fn().mockReturnValue(Promise.resolve(returnValue)),
      PUT: jest.fn().mockReturnValue(Promise.resolve()),
      POST: jest.fn().mockReturnValue(Promise.resolve()),
      DELETE: jest.fn().mockReturnValue(Promise.resolve()),
      reset: jest.fn(),
      update: jest.fn(),
      replace: jest.fn(),
    };

    return acc;
  }, {});

  const fakeResources = resources || Object.keys(Component.manifest).reduce((acc, resourceName) => {
    acc[resourceName] = {
      records: [],
    };

    return acc;
  }, {});

  const fakeStripes = stripes || STRIPES;

  return <Component {...rest} mutator={fakeMutator} resources={fakeResources} stripes={fakeStripes} />;
};

export const buildStripes = (otherProperties = {}) => ({
  actionNames: [],
  clone: buildStripes,
  connect: Comp => Comp,
  config: {
    platformName: 'bulk-edit'
  },
  currency: 'USD',
  hasInterface: jest.fn().mockReturnValue(true),
  hasPerm: mockHasPerm,
  locale: 'en-US',
  logger: {
    log: () => { },
  },
  okapi: {
    tenant: 'diku',
    url: 'https://folio-testing-okapi.dev.folio.org',
  },
  plugins: {},
  setBindings: () => { },
  setCurrency: () => { },
  setLocale: () => { },
  setSinglePlugin: () => { },
  setTimezone: () => { },
  setToken: () => { },
  store: {
    getState: () => { },
    dispatch: () => { },
    subscribe: () => { },
    replaceReducer: () => { },
  },
  timezone: 'UTC',
  user: {
    perms: {},
    user: {
      id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
      username: 'diku_admin',
      consortium: {
        centralTenantId: 'consortia',
      },
    },
  },
  withOkapi: true,
  ...otherProperties,
});

STRIPES = buildStripes();

const mockStripesCore = {
  stripesConnect,

  useOkapiKy: mockUseOkapiKy,

  useStripes: jest.fn(() => STRIPES),

  withStripes: Component => ({ stripes, ...rest }) => {
    const fakeStripes = stripes || STRIPES;

    return <Component {...rest} stripes={fakeStripes} />;
  },

  // eslint-disable-next-line react/prop-types
  Pluggable: props => (
    <>
      <button type="button" onClick={props.entityTypeDataSource}>Get query</button>
      <button type="button" onClick={props.cancelQueryDataSource}>Cancel query</button>
    </>
  ),

  // eslint-disable-next-line react/prop-types
  IfPermission: jest.fn(props => <>{props.children}</>),

  // eslint-disable-next-line react/prop-types
  IfInterface: jest.fn(props => <>{props.children}</>),

  useNamespace: ({ key }) => [`@folio/bulk-edit:${key}`],
  TitleManager: ({ children }) => <>{children}</>,
  checkIfUserInMemberTenant: () => true,
  getFullLocale: jest.fn((localeRegion, numberingSystem) => [localeRegion, numberingSystem].filter(Boolean).join('-u-nu-')),
  userOwnLocaleConfig: {
    SCOPE: 'user-locale-scope',
    KEY: 'user-locale-key',
  },
  tenantLocaleConfig: {
    SCOPE: 'tenant-locale-scope',
    KEY: 'tenant-locale-key',
  },
};

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  ...mockStripesCore
}), { virtual: true });
