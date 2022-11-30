import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  cloneDeep,
  unset,
  orderBy,
  set,
} from 'lodash';

import ServicePointForm from './ServicePointForm';
import {
  shortTermExpiryPeriod,
  shortTermClosedDateManagementMenu,
  longTermClosedDateManagementMenu
} from './constants';

const ServicePointFormContainer = ({
  onSave,
  parentResources,
  initialValues: servicePoint,
  ...rest
}) => {
  const getServicePoint = () => {
    // remove holdShelfClosedLibraryDateManagement from servicepoint object when pickupLocation is not true
    if (!servicePoint.pickupLocation) {
      unset(servicePoint, 'holdShelfClosedLibraryDateManagement');
    }
    return servicePoint;
  };

  const [initialValues, setInitialValues] = useState(getServicePoint());

  useEffect(() => {
    setInitialValues(servicePoint);
  }, [servicePoint?.id, parentResources?.staffSlips?.hasLoaded]);

  const transformStaffSlipsData = useCallback((staffSlips) => {
    const currentSlips = parentResources?.staffSlips?.records || [];
    const allSlips = orderBy(currentSlips, 'name');

    return staffSlips.map((printByDefault, index) => {
      const { id } = allSlips[index];
      return { id, printByDefault };
    });
  }, [parentResources?.staffSlips]);

  const onSubmit = useCallback((values) => {
    const data = cloneDeep(values);

    const { locationIds, staffSlips } = data;

    if (locationIds) {
      data.locationIds = locationIds.filter(l => l).map(l => (l.id ? l.id : l));
    }

    if (
      data.pickupLocation &&
      !data.holdShelfClosedLibraryDateManagement
    ) {
      if (shortTermExpiryPeriod.findIndex(item => item === data.holdShelfExpiryPeriod.intervalId) > -1) {
        set(data, 'holdShelfClosedLibraryDateManagement', shortTermClosedDateManagementMenu[0].value);
      } else {
        set(data, 'holdShelfClosedLibraryDateManagement', longTermClosedDateManagementMenu[0].value);
      }
    }

    if (!data.pickupLocation) {
      unset(data, 'holdShelfExpiryPeriod');
      unset(data, 'holdShelfClosedLibraryDateManagement');
    }

    unset(data, 'location');

    onSave({
      ...data,
      staffSlips: transformStaffSlipsData(staffSlips)
    });
  }, [onSave, transformStaffSlipsData]);

  return (
    <ServicePointForm
      {...rest}
      onSubmit={onSubmit}
      parentResources={parentResources}
      initialValues={initialValues}
    />
  );
};

ServicePointFormContainer.propTypes = {
  onSave: PropTypes.func,
  parentResources: PropTypes.object,
  initialValues: PropTypes.object
};

export default ServicePointFormContainer;
