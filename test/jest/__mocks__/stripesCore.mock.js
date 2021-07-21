import React from 'react';

jest.mock('@folio/stripes/core', () => {
  const STRIPES = {
    actionNames: [],
    clone: () => ({ ...STRIPES }),
    connect: (Component) => Component,
    config: {},
    currency: 'USD',
    hasInterface: () => true,
    hasPerm: jest.fn().mockReturnValue(true),
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
      },
    },
    withOkapi: true,
  };

  const stripesConnect = (Component, options) => ({ mutator, resources, stripes, ...rest }) => {
    const fakeMutator = mutator || Object.keys(Component.manifest).reduce((acc, mutatorName) => {
      const returnValue = Component.manifest[mutatorName].records ? [] : {};

      acc[mutatorName] = {
        GET: jest.fn().mockReturnValue(Promise.resolve(returnValue)),
        PUT: jest.fn().mockReturnValue(Promise.resolve()),
        POST: jest.fn().mockReturnValue(Promise.resolve()),
        DELETE: jest.fn().mockReturnValue(Promise.resolve()),
        reset: jest.fn(),
      };

      return acc;
    }, {});

    const fakeResources = resources || Object.keys(Component.manifest).reduce((acc, resourceName) => {
      if (options?.resources?.[resourceName]) {
        acc[resourceName] = options.resources[resourceName];
      } else {
        acc[resourceName] = {
          records: [],
        };
      }

      return acc;
    }, {});

    const fakeStripes = stripes || STRIPES;

    if (options?.stripes) {
      Object.assign(fakeStripes, options.stripes);
    }

    return <Component {...rest} mutator={fakeMutator} resources={fakeResources} stripes={fakeStripes} />;
  };

  const withStripes = (Component, options) => ({ stripes, ...rest }) => {
    const fakeStripes = stripes || STRIPES;

    fakeStripes.connect = Comp => stripesConnect(Comp, options);

    if (options?.stripes) {
      Object.assign(fakeStripes, options.stripes);
    }

    return <Component {...rest} stripes={fakeStripes} />;
  };

  const useStripes = ({ ...STRIPES, connect: Component => stripesConnect(Component) });

  return {
    ...jest.requireActual('@folio/stripes/core'),
    stripesConnect,
    useStripes,
    withStripes,
    // eslint-disable-next-line react/prop-types
    Pluggable: props => <>{props.children}</>,
    IfPermission: ({ children }) => <>{children}</>,
    supportedLocales: ['ar', 'en', 'fr-FR'],
    supportedNumberingSystems: ['latn', 'arab'],
  };
}, { virtual: true });
