import { Checkbox } from '@folio/stripes/components';
import { readingRoomAccessColumns } from './constant';

/* eslint-disable import/prefer-default-export, react/prop-types */
export const getFormatter = ({ fieldLabels }) => ({
  [readingRoomAccessColumns.ISPUBLIC]: ({ isPublic }) => (
    <Checkbox
      checked={isPublic}
      disabled
      aria-label={fieldLabels[readingRoomAccessColumns.ISPUBLIC]}
    />
  ),
  [readingRoomAccessColumns.SERVICEPOINTS]: ({ servicePoints }) => {
    const asp = servicePoints || [];
    const items = asp.map(a => <li key={a.label}>{a.label}</li>);
    return (
      <ul
        className="marginBottom0"
        aria-label={fieldLabels[readingRoomAccessColumns.SERVICEPOINTS]}
      >
        {items}
      </ul>
    );
  }
});
