import memoize from 'lodash/memoize';
import { FormattedMessage } from 'react-intl';

const vocabularyUniquenessValidator = (fields, translationIdsDict) => {
  const validate = (item, index, items) => {
    const errorsDict = fields?.reduce((acc, field) => {
      const isDuplicate = items.some((otherItem, otherIndex) => {
        return (otherIndex !== index) && (otherItem[field]?.toLocaleLowerCase() === item[field]?.toLocaleLowerCase());
      });

      if (isDuplicate) {
        return {
          ...acc,
          [field]: <FormattedMessage id={translationIdsDict?.[field]} />,
        };
      }

      return acc;
    }, {});

    return (errorsDict && Object.keys(errorsDict).length) ? errorsDict : undefined;
  };

  return { validate };
};

export default memoize(vocabularyUniquenessValidator);
