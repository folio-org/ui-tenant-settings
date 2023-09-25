import React from 'react';
import { Select, Tooltip } from '@folio/stripes/components';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { childrenOf } from '../../../util/childrenOf';
import { useRemoteStorageApi } from './Provider';

const SelectWithTooltip = ({ label, sub, ...rest }) => (
  <Tooltip
    text={label}
    sub={sub}
    id="remote-storage-tooltip"
  >
    {({ ref, ariaIds }) => (
      <Select
        label={label}
        inputRef={ref}
        aria-labelledby={ariaIds.text}
        aria-describedby={ariaIds.sub}
        {...rest}
      />
    )}
  </Tooltip>
);

const CustomSelect = ({ message, ...rest }) => (
  message
    ? <SelectWithTooltip sub={message} {...rest} />
    : <Select {...rest} />
);

export const Control = ({ disabled, readOnly, message, ...rest }) => {
  const { configurations, translate: t } = useRemoteStorageApi();

  const errorMessage = configurations.failed && t('failed');
  const loadingMessage = configurations.isPending && t('loading');
  const isDisabled = disabled || !configurations.hasLoaded;

  const configurationOptions = configurations.records.map(c => ({ label: c.name, value: c.id }));
  const defaultOption = { label: t('no'), value: '' };
  const options = configurations.hasLoaded ? [defaultOption, ...configurationOptions] : undefined;

  return (
    <CustomSelect
      dataOptions={options}
      disabled={isDisabled}
      readOnly={readOnly && !isDisabled}
      message={errorMessage || message || loadingMessage}
      {...rest}
    />
  );
};

Control.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    childrenOf(FormattedMessage)
  ]),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};

CustomSelect.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    childrenOf(FormattedMessage)
  ]),
};

SelectWithTooltip.propTypes = {
  sub: PropTypes.oneOfType([
    PropTypes.string,
    childrenOf(FormattedMessage)
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    childrenOf(FormattedMessage).isRequired
  ]).isRequired,
};
