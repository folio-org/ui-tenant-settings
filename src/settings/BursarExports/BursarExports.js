import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';

import { CalloutContext } from '@folio/stripes/core';
import {
  Button,
  LoadingPane,
  Pane,
  PaneFooter,
} from '@folio/stripes/components';

import {
  useBursarConfigQuery,
  useBursarConfigMutation,
} from './apiQuery';
import { BursarExportsConfiguration } from './BursarExportsConfiguration';

export const BursarExports = () => {
  const { formatMessage } = useIntl();
  const callout = useContext(CalloutContext);

  const { isLoading, bursarConfig } = useBursarConfigQuery();
  const { mutateBursarConfig } = useBursarConfigMutation({
    onSuccess: () => {
      return callout?.sendCallout({
        message: formatMessage({ id: 'ui-tenant-settings.settings.bursarExports.save.success' }),
        type: 'success',
      });
    },
    onError: () => {
      return callout?.sendCallout({
        timeout: 0,
        message: formatMessage({ id: 'ui-tenant-settings.settings.bursarExports.save.error' }),
        type: 'error',
      });
    },
  });

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

  if (isLoading) {
    return (
      <LoadingPane defaultWidth="fill" />
    );
  }

  return (
    <Pane
      defaultWidth="fill"
      footer={paneFooter}
      id="pane-batch-group-configuration"
      paneTitle={formatMessage({ id: 'ui-tenant-settings.settings.bursarExports' })}
    >
      <BursarExportsConfiguration
        initialValues={bursarConfig}
        onFormStateChanged={setBursarConfigForm}
        onSubmit={mutateBursarConfig}
      />
    </Pane>
  );
};
