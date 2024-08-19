import React, { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { Select, TextLink } from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import locationCodeValidator from './locationCodeValidator';
import composeValidators from '../util/composeValidators';
import { CAMPUS_ID_LIBRARIES, INSTITUTION_ID_CAMPUS, INSTITUTION_ID_LIBRARIES } from '../constants';
import { useLibraries } from '../hooks/useLibraries';
import { useInstitutions } from '../hooks/useInstitutions';
import css from './LocationInstitutions.css';


const translations = {
  cannotDeleteTermHeader: 'ui-tenant-settings.settings.location.campuses.cannotDeleteTermHeader',
  cannotDeleteTermMessage: 'ui-tenant-settings.settings.location.campuses.cannotDeleteTermMessage',
  deleteEntry: 'ui-tenant-settings.settings.location.campuses.deleteEntry',
  termDeleted: 'ui-tenant-settings.settings.location.campuses.termDeleted',
  termWillBeDeleted: 'ui-tenant-settings.settings.location.campuses.termWillBeDeleted',
};


const LocationCampuses = (props) => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const [institutionId, setInstitutionId] = useState(sessionStorage.getItem(INSTITUTION_ID_CAMPUS) || null);

  const hasAllLocationPerms = stripes.hasPerm('ui-tenant-settings.settings.location');
  const ConnectedControlledVocab = stripes.connect(ControlledVocab);

  const { institutions } = useInstitutions({
    searchParams: {
      limit: 100,
      query: 'cql.allRecords=1 sortby name',
    },
  });

  const { libraries } = useLibraries({ searchParams: {
    limit: 1000,
    query: 'cql.allRecords=1 sortby name',
  } });

  const numberOfObjectsFormatter = useCallback((item) => {
    const numberOfObjects = libraries.reduce((count, loc) => (loc.campusId === item.id ? count + 1 : count), 0);

    const onNumberOfObjectsClick = () => {
      sessionStorage.setItem(INSTITUTION_ID_LIBRARIES, institutionId);
      sessionStorage.setItem(CAMPUS_ID_LIBRARIES, item.id);
    };

    return (
      <TextLink
        onClick={onNumberOfObjectsClick}
        className={css.numberOfObjectsWrapper}
        data-testid={item.id}
        to="./location-libraries"
      >
        {numberOfObjects}
      </TextLink>
    );
  }, [libraries, institutionId]);

  const onChangeInstitution = useCallback((e) => {
    const value = e.target.value;
    setInstitutionId(value);
    sessionStorage.setItem(INSTITUTION_ID_CAMPUS, value);
  }, []);

  const institutionOptions = institutions.map(i => (
    <option value={i.id} key={i.id}>
      {i.name}
      {i.code ? ` (${i.code})` : ''}
    </option>
  ));

  if (!institutionOptions.length) {
    return <div data-testid="institutions-empty" />;
  }

  const rowFilter = (
    <Select
      label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
      id="institutionSelect"
      name="institutionSelect"
      onChange={onChangeInstitution}
      value={institutionId}
    >
      <FormattedMessage id="ui-tenant-settings.settings.location.institutions.selectInstitution">
        {selectText => (
          <option value="">{selectText}</option>
        )}
      </FormattedMessage>
      {institutionOptions}
    </Select>
  );

  return (
    <TitleManager page={formatMessage({ id: 'ui-tenant-settings.settings.location.campuses.title' })}>
      <ConnectedControlledVocab
        {...props}
        dataKey={undefined}
        baseUrl="location-units/campuses"
        records="loccamps"
        rowFilter={rowFilter}
        rowFilterFunction={(row) => row.institutionId === institutionId}
        label={formatMessage({ id: 'ui-tenant-settings.settings.location.campuses' })}
        translations={translations}
        objectLabel={<FormattedMessage id="ui-tenant-settings.settings.location.libraries" />}
        visibleFields={['name', 'code']}
        columnMapping={{
          name: <FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />,
          code: <FormattedMessage id="ui-tenant-settings.settings.location.code" />,
        }}
        formatter={{ numberOfObjects: numberOfObjectsFormatter }}
        nameKey="group"
        id="campuses"
        preCreateHook={(item) => ({ ...item, institutionId })}
        listSuppressor={() => !institutionId}
        listSuppressorText={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.missingSelection" />}
        sortby="name"
        validate={composeValidators(locationCodeValidator.validate)}
        editable={hasAllLocationPerms}
        canCreate={hasAllLocationPerms}
      />
    </TitleManager>
  );
};

export default LocationCampuses;
