import React from 'react';
import PropTypes from 'prop-types';

import { Loading, Layout, Select, Tooltip } from '@folio/stripes/components';

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

export const Control = ({ isMappingsLoading, readOnly, message, ...rest }) => {
  const {
    configurations,
    isConfigurationsLoading,
    isConfigurationsError,
    translate: t
  } = useRemoteStorageApi();

  const errorMessage = isConfigurationsError && t('failed');
  const loadingMessage = isConfigurationsLoading && t('loading');
  const isLoading = isMappingsLoading || isConfigurationsLoading;

  const configurationOptions = configurations.map(c => ({ label: c.name, value: c.id }));
  const defaultOption = { label: t('no'), value: '' };
  const options = !isConfigurationsLoading ? [defaultOption, ...configurationOptions] : undefined;

  if (isLoading) {
    return (
      <Layout className="flex marginTopLabelSpacer">
        <Loading size="large" />
      </Layout>
    );
  }

  return (
    <CustomSelect
      key={readOnly}
      dataOptions={options}
      disabled={isLoading}
      readOnly={readOnly && !isLoading}
      message={errorMessage || message || loadingMessage}
      {...rest}
    />
  );
};

Control.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  isMappingsLoading: PropTypes.bool,
  readOnly: PropTypes.bool,
};

CustomSelect.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

SelectWithTooltip.propTypes = {
  sub: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.element.isRequired
  ]).isRequired,
};
