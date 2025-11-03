import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'redux-form';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { TextArea, TextField, dayjs } from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import css from './Addresses.css';

const scope = 'ui-tenant-settings.addresses.manage';

const translations = {
  cannotDeleteTermHeader: 'ui-tenant-settings.settings.addresses.cannotDeleteTermHeader',
  cannotDeleteTermMessage: 'ui-tenant-settings.settings.addresses.cannotDeleteTermMessage',
  deleteEntry: 'ui-tenant-settings.settings.addresses.deleteEntry',
  termDeleted: 'ui-tenant-settings.settings.addresses.termDeleted',
  termWillBeDeleted: 'ui-tenant-settings.settings.addresses.termWillBeDeleted',
};

const fieldComponents = {
  address: ({ fieldProps }) => (
    <Field {...fieldProps} component={TextArea} fullWidth />
  ),
  name: ({ fieldProps }) => (
    <Field {...fieldProps} component={TextField} fullWidth />
  ),
};

const parseRow = row => {
  return {
    name: row.value.name,
    address: row.value.address,
    ...row,
  };
};

const hiddenFields = ['numberOfObjects'];
const visibleFields = ['name', 'address'];
const columnMapping = {
  name: <FormattedMessage id="ui-tenant-settings.settings.addresses.name" />,
  address: <FormattedMessage id="ui-tenant-settings.settings.addresses.address" />,
};
const objectLabel = <FormattedMessage id="ui-tenant-settings.settings.addresses.label" />;
const formatter = {
  address: item => (<div className={css.addressWrapper}>{item.address}</div>),
};
const getMeta = (userId, { isNew = false } = {}) => {
  const date = dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // ISO format

  const meta = {
    updatedByUserId: userId,
    updatedDate: date,
  };

  if (isNew) {
    meta.createdByUserId = userId;
    meta.createdDate = date;
  }

  return meta;
};

const Addresses = (props) => {
  const intl = useIntl();
  const stripes = useStripes();

  const onCreate = item => ({
    scope,
    value: item,
    key: `ADDRESS_${(new Date()).valueOf()}`,
    metadata: getMeta(stripes.user.user.id, { isNew: true }),
  });

  const onUpdate = item => ({
    scope,
    key: item.key,
    id: item.id,
    metadata: {
      ...item.metadata,
      ...getMeta(stripes.user.user.id),
    },
    value: {
      name: item.name,
      address: item.address,
    },
  });

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.address.title' })}>
      <ControlledVocab
        {...props}
        dataKey={undefined}
        baseUrl="settings/entries"
        records="items"
        parseRow={parseRow}
        label={intl.formatMessage({ id: 'ui-tenant-settings.settings.addresses.label' })}
        translations={translations}
        objectLabel={objectLabel}
        visibleFields={visibleFields}
        columnMapping={columnMapping}
        hiddenFields={hiddenFields}
        fieldComponents={fieldComponents}
        nameKey="name"
        id="addresses"
        sortby="name"
        preCreateHook={onCreate}
        preUpdateHook={onUpdate}
        formatter={formatter}
        editable={stripes.hasPerm('ui-tenant-settings.settings.addresses')}
      />
    </TitleManager>
  );
};

Addresses.manifest = Object.freeze({
  values: {
    type: 'okapi',
    path: 'settings/entries',
    records: 'items',
    throwErrors: false,
    clientGeneratePk: true,
    PUT: {
      path: 'settings/entries/%{activeRecord.id}',
    },
    DELETE: {
      path: 'settings/entries/%{activeRecord.id}',
    },
    GET: {
      params: {
        query: `scope=${scope}`,
        limit: '500',
      },
    },
  },
  updaterIds: [],
  activeRecord: {},
  updaters: {
    type: 'okapi',
    records: 'users',
    path: 'users',
    GET: {
      params: {
        query: (queryParams, pathComponents, resourceValues) => {
          if (resourceValues.updaterIds && resourceValues.updaterIds.length) {
            return `(${resourceValues.updaterIds.join(' or ')})`;
          }
          return null;
        },
      },
    },
  },
});

export default Addresses;
