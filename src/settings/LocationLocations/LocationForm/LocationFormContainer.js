import React, { useContext } from 'react';
import { cloneDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';

import { CalloutContext } from '@folio/stripes/core';

import LocationForm from './LocationForm';
import { useRemoteStorageApi } from '../RemoteStorage';
import { useLocationCreate } from '../../../hooks/useLocationCreate';
import { useLocationUpdate } from '../../../hooks/useLocationUpdate';
import { LOCATIONS } from '../../../hooks/useLocations';
import { SERVICE_POINTS } from '../../../hooks/useServicePoints';


const LocationFormContainer = ({
  onSave,
  servicePointsByName,
  initialValues: location,
  ...rest
}) => {
  const queryClient = useQueryClient();

  const callout = useContext(CalloutContext);

  const showSubmitErrorCallout = (error) => {
    callout.sendCallout({
      type: 'error',
      message: error.message || error.statusText || <FormattedMessage id="ui-tenant-settings.settings.save.error.network" />,
    });
  };

  const { setMapping } = useRemoteStorageApi();
  const sharedOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries(SERVICE_POINTS);
      queryClient.invalidateQueries(LOCATIONS);
    },
  };

  const { createLocation } = useLocationCreate(sharedOptions);
  const { updateLocation } = useLocationUpdate(sharedOptions);

  const initiateSetMapping = (...args) => setMapping(...args).catch(showSubmitErrorCallout);

  const saveData = async (formData) => {
    const { remoteId: configurationId, ...locationData } = formData;

    if (locationData.id === undefined) {
      const newLocation = await createLocation({ data: locationData });
      initiateSetMapping({ folioLocationId: newLocation?.id, configurationId });

      return newLocation;
    }

    initiateSetMapping({ folioLocationId: locationData.id, configurationId });

    return updateLocation({ locationId: locationData.id, data: locationData })
      .then(() => locationData);
  };

  const saveLocation = (updatedLocation) => {
    const data = cloneDeep(updatedLocation);

    delete data.locationId;

    const servicePointsObject = {};

    servicePointsObject.servicePointIds = [];
    data.servicePointIds.forEach((item) => {
      if (item.selectSP) {
        servicePointsObject.servicePointIds.push(servicePointsByName[item.selectSP]);
        if (item.primary) servicePointsObject.primaryServicePoint = servicePointsByName[item.selectSP];
      }
    });

    const detailsObject = {};
    if (!data.detailsArray) {
      data.detailsArray = [];
    }
    data.detailsArray.forEach(i => {
      if (i.name !== undefined) detailsObject[i.name] = i.value;
    });
    delete data.detailsArray;
    data.details = detailsObject;
    data.primaryServicePoint = servicePointsObject.primaryServicePoint;
    data.servicePointIds = servicePointsObject.servicePointIds;

    saveData(data)
      .then(onSave)
      .catch(showSubmitErrorCallout);
  };

  return Boolean(location) && (
    <LocationForm
      {...rest}
      initialValues={location}
      onSubmit={saveLocation}
    />
  );
};

LocationFormContainer.propTypes = {
  onSave: PropTypes.func,
  servicePointsByName: PropTypes.objectOf(
    PropTypes.string,
  ),
  initialValues: PropTypes.shape({
    id: PropTypes.string,
  }),
};

export default LocationFormContainer;
