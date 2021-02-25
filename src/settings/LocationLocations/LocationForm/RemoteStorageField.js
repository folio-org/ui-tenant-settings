import React, { useState, useEffect, useMemo } from 'react';
import { useField } from 'react-final-form';

import { useStripes } from '@folio/stripes-core';

import { Control, useRemoteStorageApi } from '../RemoteStorage';

export const RemoteStorageField = ({ initialValues, checkLocationHasHoldingsOrItems }) => {
  const stripes = useStripes();
  const noInterfaces = useMemo(
    () => !stripes.hasInterface('remote-storage-configurations') || !stripes.hasInterface('remote-storage-mappings'),
    [stripes]
  );

  const { remoteMap, mappings, translate: t } = useRemoteStorageApi();

  const [isReadOnly, setIsReadOnly] = useState(true);

  const locationId = initialValues?.id;

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
    [locationId, noInterfaces]
  );

  if (noInterfaces) return null;

  const message = (mappings.failed && t('failed')) || (mappings.isPending && t('loading')) || (isReadOnly && t('readonly'));

  const isDisabled = !mappings.hasLoaded;

  return (
    <Control
      label={t('remote')}
      required
      disabled={isDisabled}
      readOnly={isReadOnly && !isDisabled}
      message={message}
      {...field}
    />
  );
};
