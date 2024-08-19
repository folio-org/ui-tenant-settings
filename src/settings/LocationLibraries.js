import React, { useState, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { Select, TextLink } from '@folio/stripes/components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import composeValidators from '../util/composeValidators';
import locationCodeValidator from './locationCodeValidator';
import {
  CAMPUS_ID_LIBRARIES,
  INSTITUTION_ID_LIBRARIES,
  LOCATION_CAMPUS_ID_KEY,
  LOCATION_INSTITUTION_ID_KEY,
  LOCATION_LIBRARY_ID_KEY
} from '../constants';
import css from './LocationInstitutions.css';
import { useInstitutions } from '../hooks/useInstitutions';
import { useCampuses } from '../hooks/useCampuses';
import { useLocations } from '../hooks/useLocations';

const translations = {
  cannotDeleteTermHeader: 'ui-tenant-settings.settings.location.libraries.cannotDeleteTermHeader',
  cannotDeleteTermMessage: 'ui-tenant-settings.settings.location.libraries.cannotDeleteTermMessage',
  deleteEntry: 'ui-tenant-settings.settings.location.libraries.deleteEntry',
  termDeleted: 'ui-tenant-settings.settings.location.libraries.termDeleted',
  termWillBeDeleted: 'ui-tenant-settings.settings.location.libraries.termWillBeDeleted',
};


const LocationLibraries = (props) => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const [institutionId, setInstitutionId] = useState(sessionStorage.getItem(INSTITUTION_ID_LIBRARIES) || null);
  const [campusId, setCampusId] = useState(sessionStorage.getItem(CAMPUS_ID_LIBRARIES) || null);

  const hasAllLocationPerms = stripes.hasPerm('ui-tenant-settings.settings.location');
  const ConnectedControlledVocab = stripes.connect(ControlledVocab);

  const { institutions } = useInstitutions({ searchParams: {
    limit: 100,
    query: 'cql.allRecords=1 sortby name',
  } });

  const { campuses } = useCampuses({ searchParams: {
    limit: 100,
    query: 'cql.allRecords=1 sortby name',
  } });

  const { locations } = useLocations({ searchParams: {
    limit: 10000,
    query: 'cql.allRecords=1 sortby name',
  } });

  useEffect(() => {
    sessionStorage.setItem(INSTITUTION_ID_LIBRARIES, institutionId);
    sessionStorage.setItem(CAMPUS_ID_LIBRARIES, campusId);
  }, [institutionId, campusId]);

  const numberOfObjectsFormatter = useCallback((item) => {
    const numberOfObjects = locations.reduce((count, loc) => (loc.libraryId === item.id ? count + 1 : count), 0);

    const onNumberOfObjectsClick = () => {
      sessionStorage.setItem(LOCATION_LIBRARY_ID_KEY, item.id);
      sessionStorage.setItem(LOCATION_INSTITUTION_ID_KEY, institutionId);
      sessionStorage.setItem(LOCATION_CAMPUS_ID_KEY, campusId);
    };

    return (
      <TextLink
        onClick={onNumberOfObjectsClick}
        className={css.numberOfObjectsWrapper}
        data-testid={item.id}
        to="./location-locations"
      >
        {numberOfObjects}
      </TextLink>
    );
  }, [locations, institutionId, campusId]);

  const onChangeInstitution = useCallback((e) => {
    const value = e.target.value;
    setInstitutionId(value);
    setCampusId(null);
  }, []);

  const onChangeCampus = useCallback((e) => {
    const value = e.target.value;
    setCampusId(value);
  }, []);

  const institutionOptions = institutions.map(i => (
    <option value={i.id} key={i.id}>
      {i.name}
      {i.code ? ` (${i.code})` : ''}
    </option>
  ));

  const campusOptions = campuses.filter(c => c.institutionId === institutionId).map(c => (
    <option value={c.id} key={c.id}>
      {c.name}
      {c.code ? ` (${c.code})` : ''}
    </option>
  ));

  if (!institutionOptions.length) {
    return <div data-testid="libraries-empty" />;
  }

  const filterBlock = (
    <>
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
      {institutionId && (
        <Select
          label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
          id="campusSelect"
          name="campusSelect"
          onChange={onChangeCampus}
          value={campusId}
        >
          <FormattedMessage id="ui-tenant-settings.settings.location.campuses.selectCampus">
            {selectText => (
              <option value="">{selectText}</option>
            )}
          </FormattedMessage>
          {campusOptions}
        </Select>
      )}
    </>
  );

  return (
    <TitleManager page={formatMessage({ id: 'ui-tenant-settings.settings.location.libraries.title' })}>
      <ConnectedControlledVocab
        {...props}
        dataKey={undefined}
        baseUrl="location-units/libraries"
        records="loclibs"
        rowFilter={filterBlock}
        rowFilterFunction={(row) => row.campusId === campusId}
        label={formatMessage({ id: 'ui-tenant-settings.settings.location.libraries' })}
        translations={translations}
        objectLabel={<FormattedMessage id="ui-tenant-settings.settings.location.locations" />}
        visibleFields={['name', 'code']}
        columnMapping={{
          name: <FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />,
          code: <FormattedMessage id="ui-tenant-settings.settings.location.code" />,
        }}
        formatter={{ numberOfObjects: numberOfObjectsFormatter }}
        nameKey="group"
        id="libraries"
        preCreateHook={(item) => ({ ...item, campusId })}
        listSuppressor={() => !(institutionId && campusId)}
        listSuppressorText={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.missingSelection" />}
        sortby="name"
        validate={composeValidators(locationCodeValidator.validate)}
        editable={hasAllLocationPerms}
        canCreate={hasAllLocationPerms}
      />
    </TitleManager>
  );
};

export default LocationLibraries;
