import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  AutoSuggest,
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../../../components/RepeatableField';
import { useLocations } from '../../../hooks/useLocations';


const DetailsField = () => {
  const { locations } = useLocations({ searchParams: {
    query: '(details=*)'
  } });

  const getSuggestedTerms = (locationsArray) => {
    const terms = [];
    for (const item of locationsArray) {
      if (item.details) {
        Object.keys(item.details).forEach(name => {
          if (!terms.includes(name)) {
            terms.push(name);
          }
        });
      }
    }
    return terms;
  };

  const suggestedTerms = getSuggestedTerms(locations);
  const detailNames = useMemo(() => (suggestedTerms.length > 0 ? suggestedTerms.map(locationName => (
    { value: locationName })) : []), [suggestedTerms]);

  return (
    <RepeatableField
      name="detailsArray"
      addLabel={
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-tenant-settings.settings.location.locations.addDetails" />
        </Icon>
      }
      addButtonId="clickable-add-location-details"
      template={[
        {
          name: 'name',
          label: <FormattedMessage id="ui-tenant-settings.settings.location.locations.detailsName" />,
          component: AutoSuggest,
          items: detailNames,
          renderValue: item => item.value || '',
          withFinalForm: true,
        },
        {
          name: 'value',
          label: <FormattedMessage id="ui-tenant-settings.settings.location.locations.detailsValue" />,
          component: TextField,
        },
      ]}
      newItemTemplate={{ name: '', value: '' }}
    />
  );
};

export default DetailsField;
