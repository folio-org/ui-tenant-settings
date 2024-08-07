import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { TextLink } from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import composeValidators from '../util/composeValidators';
import locationCodeValidator from './locationCodeValidator';
import { INSTITUTION_ID_CAMPUS } from '../constants';
import { useCampuses } from '../hooks/useCampuses';
import css from './LocationInstitutions.css';

const translations = {
  cannotDeleteTermHeader: 'ui-tenant-settings.settings.location.institutions.cannotDeleteTermHeader',
  cannotDeleteTermMessage: 'ui-tenant-settings.settings.location.institutions.cannotDeleteTermMessage',
  deleteEntry: 'ui-tenant-settings.settings.location.institutions.deleteEntry',
  termDeleted: 'ui-tenant-settings.settings.location.institutions.termDeleted',
  termWillBeDeleted: 'ui-tenant-settings.settings.location.institutions.termWillBeDeleted',
};


const LocationInstitutions = (props) => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const hasAllLocationPerms = stripes.hasPerm('ui-tenant-settings.settings.location');
  const ConnectedControlledVocab = stripes.connect(ControlledVocab);

  const { campuses } = useCampuses({ searchParams: {
    limit: 1000,
    query: 'cql.allRecords=1 sortby name',
  } });

  const numberOfObjectsFormatter = (item) => {
    const numberOfObjects = campuses.reduce((count, loc) => {
      return loc.institutionId === item.id ? count + 1 : count;
    }, 0);

    const onNumberOfObjectsClick = () => {
      sessionStorage.setItem(INSTITUTION_ID_CAMPUS, item.id);
    };

    return (
      <TextLink
        onClick={onNumberOfObjectsClick}
        className={css.numberOfObjectsWrapper}
        to="./location-campuses"
      >
        {numberOfObjects}
      </TextLink>
    );
  };

  const formatter = {
    numberOfObjects: numberOfObjectsFormatter,
  };

  return (
    <TitleManager
      stripes={stripes}
      page={formatMessage({ id: 'ui-tenant-settings.settings.location.institutions.title' })}
    >
      <ConnectedControlledVocab
        {...props}
        dataKey={undefined}
        baseUrl="location-units/institutions"
        records="locinsts"
        label={formatMessage({ id: 'ui-tenant-settings.settings.location.institutions' })}
        translations={translations}
        objectLabel={<FormattedMessage id="ui-tenant-settings.settings.location.campuses" />}
        visibleFields={['name', 'code']}
        columnMapping={{
          name: <FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />,
          code: <FormattedMessage id="ui-tenant-settings.settings.location.code" />,
        }}
        formatter={formatter}
        nameKey="name"
        id="institutions"
        sortby="name"
        validate={composeValidators(locationCodeValidator.validate)}
        editable={hasAllLocationPerms}
        canCreate={hasAllLocationPerms}
      />
    </TitleManager>
  );
};

export default LocationInstitutions;
