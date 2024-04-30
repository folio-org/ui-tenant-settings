import { Checkbox } from '@folio/stripes/components';
import { readingRoomAccessColumns } from './constant';

/* eslint-disable import/prefer-default-export */
export const getFormatter = ({ fieldLabels }) => ({
  [readingRoomAccessColumns.ISPUBLIC]: (record) => (
    <Checkbox
      checked={record.isPublic}
      disabled
      aria-label={fieldLabels[readingRoomAccessColumns.ISPUBLIC]}
    />
  ),
  [readingRoomAccessColumns.SERVICEPOINTS]: (record) => {
    const asp = record.servicePoints || [];
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
