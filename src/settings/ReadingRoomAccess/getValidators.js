/* eslint-disable import/prefer-default-export */
import { FormattedMessage } from 'react-intl';
import { readingRoomAccessColumns } from './constant';

const validators = {
  [readingRoomAccessColumns.NAME]: function validateName(item, items) {
    const { id, name } = item;
    if (!name) {
      return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
    }

    const allOtherNames = items.filter(r => r.id !== id).map(r => r.name);

    if (allOtherNames.some(itemName => itemName === name)) {
      return <FormattedMessage id="ui-marc-authorities.settings.manageAuthoritySourceFiles.error.name.unique" />;
    }

    return undefined;
  },
  [readingRoomAccessColumns.SERVICEPOINTS]: function validateServicePoints(item) {
    const { servicePoints } = item;
    if (!servicePoints) {
      return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
    }
    return undefined;
  },
};

export const getValidators = field => validators[field];
