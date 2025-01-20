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
  omit,
} from 'lodash';

import { TitleManager } from '@folio/stripes/core';
import { useIntl } from 'react-intl';
import ServicePointForm from './ServicePointForm';

const ServicePointFormContainer = ({
  onSave,
  parentResources,
  initialValues: servicePoint,
  ...rest
}) => {
  const getServicePoint = useCallback(() => {
    // remove holdShelfClosedLibraryDateManagement from servicepoint object when pickupLocation is not true
    if (!servicePoint.pickupLocation) {
      const newServicePoint = omit(servicePoint, 'holdShelfClosedLibraryDateManagement');
      return newServicePoint;
    } else {
      return servicePoint;
    }
  }, [servicePoint]);

  const [initialValues, setInitialValues] = useState(getServicePoint());
  const intl = useIntl();

  useEffect(() => {
    setInitialValues(getServicePoint());
  }, [servicePoint.id, parentResources.staffSlips.hasLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

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

    if (!data.pickupLocation) {
      unset(data, 'holdShelfExpiryPeriod');
      unset(data, 'holdShelfClosedLibraryDateManagement');
    }

    if (data.ecsRequestRouting) {
      unset(data, 'shelvingLagTime');
      unset(data, 'pickupLocation');
      unset(data, 'holdShelfExpiryPeriod');
      unset(data, 'holdShelfClosedLibraryDateManagement');
      unset(data, 'staffSlips');
    } else {
      data.staffSlips = transformStaffSlipsData(staffSlips);
    }

    unset(data, 'location');

    onSave(data);
  }, [onSave, transformStaffSlipsData]);

  const titleManagerLabel = initialValues.name ? intl.formatMessage({ id:'ui-tenant-settings.settings.items.edit.title' }, { item: initialValues?.name })
    :
    intl.formatMessage({ id:'ui-tenant-settings.settings.newService.title' });

  return (
    <TitleManager page={titleManagerLabel}>
      <ServicePointForm
        {...rest}
        onSubmit={onSubmit}
        parentResources={parentResources}
        initialValues={initialValues}
      />
    </TitleManager>
  );
};

ServicePointFormContainer.propTypes = {
  onSave: PropTypes.func,
  parentResources: PropTypes.object,
  initialValues: PropTypes.object
};

export default ServicePointFormContainer;
