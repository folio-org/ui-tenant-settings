import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import {
  Button,
  Pane,
  PaneFooter,
} from '@folio/stripes/components';

import { BursarExportsConfiguration } from './BursarExportsConfiguration';

export const BursarExports = () => {
  const { formatMessage } = useIntl();

  const [bursarConfigForm, setBursarConfigForm] = useState();
  const bursarConfigFormState = bursarConfigForm?.getState();

  const saveBursarConfig = () => {
    return bursarConfigForm?.submit();
  };

  const paneFooter = (
    <PaneFooter
      renderEnd={
        <Button
          buttonStyle="primary mega"
          disabled={bursarConfigFormState?.pristine || bursarConfigFormState?.submitting}
          onClick={saveBursarConfig}
          type="submit"
        >
          {formatMessage({ id: 'ui-tenant-settings.settings.bursarExports.save' })}
        </Button>
      }
    />
  );

  return (
    <Pane
      defaultWidth="fill"
      footer={paneFooter}
      id="pane-batch-group-configuration"
      paneTitle={formatMessage({ id: 'ui-tenant-settings.settings.bursarExports' })}
    >
      <BursarExportsConfiguration
        onFormStateChanged={setBursarConfigForm}
        onSubmit={(values) => { console.log(values); }}
      />
    </Pane>
  );
};
