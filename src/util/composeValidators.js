const composeValidators = (...validators) => (values, ...rest) => {
  return validators.reduce((errors, validator) => Object.assign(errors, validator(values, ...rest)), {});
};

export default composeValidators;
