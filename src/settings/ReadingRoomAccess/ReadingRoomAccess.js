import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import _ from 'lodash';

import {
  TitleManager,
  withStripes,
  stripesShape
} from '@folio/stripes/core';
import { Label } from '@folio/stripes/components';
import { ControlledVocab } from '@folio/stripes/smart-components';

import { readingRoomAccessColumns } from './constant';
import { getFormatter } from './getFormatter';
import { getFieldComponents } from './getFieldComponents';
import { getValidators } from './getValidators';

const hiddenFields = ['numberOfObjects', 'lastUpdated'];
const translations = {
  cannotDeleteTermHeader: 'ui-tenant-settings.settings.addresses.cannotDeleteTermHeader',
  cannotDeleteTermMessage: 'ui-tenant-settings.settings.addresses.cannotDeleteTermMessage',
  deleteEntry: 'ui-tenant-settings.settings.reading-room-access.deleteEntry',
  termDeleted: 'ui-tenant-settings.settings.reading-room-access.termDeleted',
  termWillBeDeleted: 'ui-tenant-settings.settings.reading-room-access.termWillBeDeleted',
};

const ReadingRoomAccess = (props) => {
  const intl = useIntl();
  const { resources, stripes } = props;

  // service points defined in the tenant
  const servicePoints = _.get(resources, ['RRAServicePoints', 'records', 0, 'servicepoints'], []);
  /**
   * A reading room can have more than one service points assigned to it.
   * but a servicepoint cannot be mapped to more than one reading room
  */
  const sps = [];
  const rrs = _.get(resources, ['values', 'records']);
  rrs.forEach(rr => {
    const asp = rr.servicePoints || [];
    asp.forEach(s => {
      if (!sps.includes(s.value)) {
        sps.push(s.value);
      }
    });
  });

  const options = [];
  servicePoints.forEach(s => {
    if (!sps.includes(s.id) || s.name === 'None') {
      options.push({ value: s.id, label: s.name });
    }
  });

  const fieldLabels = useMemo(() => ({
    [readingRoomAccessColumns.NAME]: intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room-access.name' }),
    [readingRoomAccessColumns.ISPUBLIC]: intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room-access.public' }),
    [readingRoomAccessColumns.SERVICEPOINTS]: intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room-access.asp' }),
  }), [intl]);

  const visibleFields = useMemo(() => ([
    readingRoomAccessColumns.NAME,
    readingRoomAccessColumns.ISPUBLIC,
    readingRoomAccessColumns.SERVICEPOINTS,
  ]), []);

  const getRequiredLabel = useCallback(columnLabel => (
    <Label required>{columnLabel}</Label>
  ), []);

  const columnMapping = useMemo(() => ({
    [readingRoomAccessColumns.NAME]: getRequiredLabel(fieldLabels[readingRoomAccessColumns.NAME]),
    [readingRoomAccessColumns.ISPUBLIC]: fieldLabels[readingRoomAccessColumns.ISPUBLIC],
    [readingRoomAccessColumns.SERVICEPOINTS]: getRequiredLabel(fieldLabels[readingRoomAccessColumns.SERVICEPOINTS])
  }), [fieldLabels, getRequiredLabel]);

  const formatter = useMemo(() => getFormatter({ fieldLabels }), [fieldLabels]);

  const validateItem = useCallback((item, items) => {
    const errors = Object.values(readingRoomAccessColumns).reduce((acc, field) => {
      const error = getValidators(field)?.(item, items);

      if (error) {
        acc[field] = error;
      }

      return acc;
    }, {});

    return errors;
  }, []);

  const validate = (item, index, items) => {
    const itemErrors = validateItem(item, items) || {};

    return itemErrors;
  };

  const editable = stripes.hasPerm('ui-tenant-settings.settings.reading-room-access.all');

  return (
    <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room.title' })}>
      <ControlledVocab
        {...props}
        id="reading-room-access-settings"
        baseUrl="reading-room"
        stripes={stripes}
        label={intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room-access.label' })}
        objectLabel={intl.formatMessage({ id: 'ui-tenant-settings.settings.reading-room-access.label' })}
        records="readingRooms"
        visibleFields={visibleFields}
        columnMapping={columnMapping}
        hiddenFields={hiddenFields}
        formatter={formatter}
        translations={translations}
        editable={editable}
        fieldComponents={getFieldComponents(fieldLabels, options)}
        validate={validate}
        formType="final-form"
      />
    </TitleManager>
  );
};

ReadingRoomAccess.manifest = Object.freeze({
  values: {
    type: 'okapi',
    records: 'readingRooms',
    path: 'reading-room',
    GET: {
      path: 'reading-room?query=cql.allRecords=1 sortby name&limit=100'
    }
  },
  updaterIds: [],
  activeRecord: {},
  RRAServicePoints: {
    type: 'okapi',
    resource: 'service-points',
    path: 'service-points?limit=200',
  },
});

ReadingRoomAccess.propTypes = {
  resources: PropTypes.object,
  mutator: PropTypes.object,
  stripes: stripesShape.isRequired,
};

export default withStripes(ReadingRoomAccess);
