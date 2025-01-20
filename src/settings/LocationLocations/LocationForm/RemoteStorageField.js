import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'react-final-form';

import { useStripes } from '@folio/stripes/core';

import { Control, useRemoteStorageApi } from '../RemoteStorage';


export const RemoteStorageField = ({ initialValues, checkLocationHasHoldingsOrItems }) => {
  const stripes = useStripes();
  const noInterfaces = useMemo(
    () => !stripes.hasInterface('remote-storage-configurations') || !stripes.hasInterface('remote-storage-mappings'),
    [stripes]
  );

  const { remoteMap, isMappingsError, isMappingsLoading, translate: t } = useRemoteStorageApi();

  const [isReadOnly, setIsReadOnly] = useState(true);

  const locationId = initialValues?.locationId || initialValues?.id;

  const field = useField('remoteId', { initialValue: remoteMap[locationId] });

  useEffect(
    () => {
      if (noInterfaces) return;

      const isNewLocation = (locationId === undefined);

      if (isNewLocation) {
        setIsReadOnly(false);
        return;
      }

      setIsReadOnly(true);
      checkLocationHasHoldingsOrItems(locationId).then(setIsReadOnly);
    },
    [locationId, noInterfaces] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (noInterfaces) return null;

  const message = (isMappingsError && t('failed')) || (isMappingsLoading && t('loading')) || (isReadOnly && t('readonly'));

  return (
    <Control
      label={t('remote')}
      required
      disabled={isMappingsLoading}
      readOnly={isReadOnly && !isMappingsLoading}
      message={message}
      {...field}
    />
  );
};

RemoteStorageField.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    locationId: PropTypes.string,
  }),
  checkLocationHasHoldingsOrItems: PropTypes.func
};
