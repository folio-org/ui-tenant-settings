import React from 'react';
import { useIntl } from 'react-intl';

import {
  Col,
  Pane,
  Row,
} from '@folio/stripes/components';

export const BursarExports = () => {
  const { formatMessage } = useIntl();

  const paneFooter = (
    <div>
      Bursar exports footer
    </div>
  );

  return (
    <Pane
      defaultWidth="fill"
      footer={paneFooter}
      id="pane-batch-group-configuration"
      paneTitle={formatMessage({ id: 'ui-tenant-settings.settings.bursarExports' })}
    >
      <Row>
        <Col>
          Bursar exports configuration
        </Col>
      </Row>
    </Pane>
  );
};
