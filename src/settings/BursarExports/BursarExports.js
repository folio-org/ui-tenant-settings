import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';

export const BursarExports = () => {
  return (
    <Pluggable type="bursar-export">
      <Pane>
        <FormattedMessage id="ui-tenant-settings.settings.bursarExports.notAvailable" />
      </Pane>
    </Pluggable>
  );
};
