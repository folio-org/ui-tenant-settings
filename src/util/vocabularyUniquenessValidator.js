import memoize from 'lodash/memoize';
import { FormattedMessage } from 'react-intl';


/**
 *
 * @param {Array} configs - Array of configuration objects for uniqueness validation.
 * Each configuration object should have the following structure:
 * {
 *   field: string - The name of the field to validate for uniqueness.
 *   messageId: string - The translation ID for the validation error message.
 * }
 *
 * @returns {Object} An object containing the validate function for uniqueness checking.
 */
const vocabularyUniquenessValidator = (configs = []) => {
  const validate = (item, index, items) => {
    const errorsDict = configs?.reduce((acc, config) => {
      const { field, messageId } = config;

      const isDuplicate = items.some((otherItem, otherIndex) => {
        return (otherIndex !== index) && (otherItem[field]?.toLocaleLowerCase() === item[field]?.toLocaleLowerCase());
      });

      if (isDuplicate) {
        return {
          ...acc,
          [field]: <FormattedMessage id={messageId} />,
        };
      }

      return acc;
    }, {});

    return (errorsDict && Object.keys(errorsDict).length) ? errorsDict : undefined;
  };

  return { validate };
};

export default memoize(vocabularyUniquenessValidator);
