import React from 'react';

jest.mock('@folio/stripes-smart-components/lib/ControlledVocab', () => jest.fn(({
  formatter,
  rowFilter,
  label,
  rowFilterFunction,
  preCreateHook,
  listSuppressor,
}) => (
  <>
    <span>{label}</span>
    <div onChange={rowFilterFunction}>{rowFilter}</div>
    <button
      data-testid="button-new"
      type="button"
      onClick={() => {
        preCreateHook();
        listSuppressor();
      }}
    >
      {'New'}
    </button>
    <span>
      {formatter.numberOfObjects(
        {
          'id': '1',
          'name': 'Københavns Universitet',
          'code': 'KU',
        }
      )}
    </span>
  </>
)));
