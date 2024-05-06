/* eslint-disable import/prefer-default-export */
import { FormattedMessage } from 'react-intl';
import { readingRoomAccessColumns } from './constant';

const validators = {
  [readingRoomAccessColumns.NAME]: (item) => {
    const { name } = item;
    if (!name) {
      return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
    }

    return undefined;
  },
  [readingRoomAccessColumns.SERVICEPOINTS]: (item) => {
    const { servicePoints } = item;
    if (!servicePoints.length) {
      return <FormattedMessage id="stripes-core.label.missingRequiredField" />;
    }
    return undefined;
  },
};

export const getValidators = field => validators[field];
