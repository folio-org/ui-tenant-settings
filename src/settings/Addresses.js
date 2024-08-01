import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'redux-form';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { TextArea, TextField } from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import css from './Addresses.css';


const moduleName = 'TENANT';
const configName = 'tenant.addresses';

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
  const value = JSON.parse(row.value || '{}');
  return {
    name: value.name,
    address: value.address,
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


const Addresses = (props) => {
  const intl = useIntl();
  const stripes = useStripes();

  const onCreate = item => ({
    value: JSON.stringify(item),
    module: moduleName,
    configName,
    code: `ADDRESS_${(new Date()).valueOf()}`,
  });

  const onUpdate = item => ({
    code: item.code,
    id: item.id,
    module: item.module,
    configName: item.configName,
    value: JSON.stringify({
      name: item.name,
      address: item.address,
    }),
  });

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.address.title' })}>
      <ControlledVocab
        {...props}
        dataKey={undefined}
        baseUrl="configurations/entries"
        records="configs"
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
    path: 'configurations/entries',
    records: 'configs',
    throwErrors: false,
    clientGeneratePk: true,
    PUT: {
      path: 'configurations/entries/%{activeRecord.id}',
    },
    DELETE: {
      path: 'configurations/entries/%{activeRecord.id}',
    },
    GET: {
      params: {
        query: `(module=${moduleName} and configName=${configName})`,
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
