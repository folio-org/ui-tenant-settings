import React, { useState, useEffect } from 'react';
import { useField } from 'react-final-form';
import { isEmpty } from 'lodash';

import { Control, useRemoteStorageApi } from '../RemoteStorage';

export const RemoteStorageField = ({ initialValues, checkLocationHasHoldingsOrItems }) => {
  const { remoteMap, translate: t } = useRemoteStorageApi();

  const [isReadOnly, setIsReadOnly] = useState(true);

  const locationId = initialValues?.id;

  const field = useField('remoteId', { initialValue: remoteMap[locationId] });

  useEffect(
    () => {
      const isNewLocation = (locationId === undefined);

      if (isNewLocation) {
        setIsReadOnly(false);
        return;
      }

      setIsReadOnly(true);
      checkLocationHasHoldingsOrItems(locationId).then(setIsReadOnly);
    },
    [locationId]
  );

  const message = (isReadOnly && t('readonly'));

  const isDisabled = isEmpty(remoteMap);

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
