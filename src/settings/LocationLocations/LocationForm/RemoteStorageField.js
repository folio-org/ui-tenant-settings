import React from 'react';
import { useField } from 'react-final-form';

import { Control, useRemoteStorageApi } from '../RemoteStorage';

export const RemoteStorageField = ({ initialValues, checkLocationHasHoldingsOrItems }) => {
  const { remoteMap, mappings, translate: t } = useRemoteStorageApi();

  const [isReadOnly, setIsReadOnly] = React.useState(true);

  const locationId = initialValues?.id;

  const field = useField('remoteId', { initialValue: remoteMap[locationId] });

  React.useEffect(
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
