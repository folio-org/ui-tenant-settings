import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  stripesConnect,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';

import { TENANT_ADDRESSES_API } from '../constants';
import composeValidators from '../util/composeValidators';
import vocabularyUniquenessValidator from '../util/vocabularyUniquenessValidator';

import css from './Addresses.css';

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

const uniquenessConfigs = [
  {
    field: 'name',
    messageId: 'ui-tenant-settings.settings.addresses.validation.name.unique',
  },
];

const ConnectedControlledVocab = stripesConnect(ControlledVocab);

const Addresses = (props) => {
  const intl = useIntl();
  const stripes = useStripes();

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.address.title' })}>
      <ConnectedControlledVocab
        {...props}
        baseUrl={TENANT_ADDRESSES_API}
        columnMapping={columnMapping}
        dataKey={undefined}
        editable={stripes.hasPerm('ui-tenant-settings.settings.addresses')}
        fieldComponents={fieldComponents}
        formatter={formatter}
        formType="final-form"
        hiddenFields={hiddenFields}
        id="addresses"
        label={intl.formatMessage({ id: 'ui-tenant-settings.settings.addresses.label' })}
        nameKey="name"
        objectLabel={objectLabel}
        records="addresses"
        sortby="name"
        translations={translations}
        validate={composeValidators(vocabularyUniquenessValidator(uniquenessConfigs).validate)}
        visibleFields={visibleFields}
      />
    </TitleManager>
  );
};

export default Addresses;
