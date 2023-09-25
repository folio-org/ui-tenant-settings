const requirable = (predicate) => {
  const propType = (props, propName, ...rest) => {
    // don't do any validation if empty
    if (props[propName] === undefined) {
      return null;
    }

    return predicate(props, propName, ...rest);
  };

  propType.isRequired = (props, propName, componentName, ...rest) => {
    // warn if empty
    if (props[propName] === undefined) {
      return new Error(`Required prop \`${propName}\` was not specified in \`${componentName}\`.`);
    }

    return predicate(props, propName, componentName, ...rest);
  };

  return propType;
};

export const childrenOf = (...types) => {
  return requirable((props, propName, componentName, location = 'prop', propFullName = propName) => {
    const component = props[propName];

    const check = c => types.some(type => type === c.type);
    const valid = Array.isArray(component) ? component.every(check) : check(component);
    if (!valid) {
      return new Error(
        // eslint-disable-next-line
                `Invalid ${location} \`${propFullName}\` supplied to \`${componentName}\`. Every element must be a <${types.map(t => getDisplayName(t)).join('|')}>.`
      );
    }
    return null;
  });
};
