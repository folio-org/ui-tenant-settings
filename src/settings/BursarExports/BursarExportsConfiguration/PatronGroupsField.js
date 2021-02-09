import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';
import { find } from 'lodash';

import {
  MultiSelection,
} from '@folio/stripes/components';

import { validateRequired } from './validation';

const itemToString = item => item;
const onBlurDefault = e => { e.preventDefault(); };

export const PatronGroupsField = ({ patronGroups = [] }) => {
  const { formatMessage } = useIntl();

  const getOptionLabel = useCallback(({ option }) => {
    return find(patronGroups, { id: option })?.group || '-';
  }, [patronGroups]);

  const dataOptions = useMemo(() => {
    return patronGroups.map(patronGroup => patronGroup.id);
  }, [patronGroups]);

  return (
    <Field
      data-testid="patron-groups"
      component={MultiSelection}
      label={formatMessage({
        id: 'ui-tenant-settings.settings.bursarExports.patronGroups'
      })}
      name="patronGroups"
      dataOptions={dataOptions}
      itemToString={itemToString}
      formatter={getOptionLabel}
      onBlur={onBlurDefault}
      required
      validate={validateRequired}
    />
  );
};

PatronGroupsField.propTypes = {
  patronGroups: PropTypes.arrayOf(PropTypes.object),
};
