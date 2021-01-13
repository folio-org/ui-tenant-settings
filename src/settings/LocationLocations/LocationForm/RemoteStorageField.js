import React from 'react';
import { useField } from 'react-final-form';

import { Control, useRemoteStorageApi } from '../RemoteStorage';

export const RemoteStorageField = ({ initialValues, checkLocationHasHoldingsOrItems }) => {
  const { remoteMap, mappings, t } = useRemoteStorageApi();

  const [isReadOnly, setIsReadOnly] = React.useState(true);

  const locationId = initialValues?.id;

  const field = useField('remoteId', { initialValue: remoteMap[locationId] });

  React.useEffect(
    () => {
      // For new locations - initial state is NOT read-only
      if (locationId === undefined) {
        setIsReadOnly(false);
        return;
      }

      // Initial state is read-only, until we get assured there are no Holdings or Items associated
      setIsReadOnly(true);
      checkLocationHasHoldingsOrItems(locationId).then(setIsReadOnly);
    },
    [locationId]
  );

  const message = (mappings.failed && t`failed`) || (mappings.isPending && t`loading`) || (isReadOnly && t`readonly`);

  const isDisabled = !mappings.hasLoaded;

  return (
    <Control
      label={t`remote`}
      required
      disabled={isDisabled}
      readOnly={isReadOnly && !isDisabled}
      message={message}
      {...field}
    />
  );
};
