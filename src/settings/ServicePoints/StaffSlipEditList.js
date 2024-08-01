import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { Col, Row, Checkbox } from '@folio/stripes/components';


const StaffSlipEditList = ({ staffSlips }) => {
  const renderList = () => {
    const items = staffSlips.map((staffSlip, index) => (
      <Row key={`staff-slip-row-${index}`}>
        <Col xs={12}>
          <Field
            component={Checkbox}
            type="checkbox"
            id={`staff-slip-checkbox-${index}`}
            label={staffSlip.name}
            name={`staffSlips[${index}]`}
          />
        </Col>
      </Row>
    ));

    return (
      <>
        <p>
          <FormattedMessage id="ui-tenant-settings.settings.servicePoints.printByDefault" />
        </p>
        {items}
      </>
    );
  };

  return (
    <FieldArray
      data-test-staff-slip-edit-list
      name="staffSlips"
      component={renderList}
    />
  );
};

StaffSlipEditList.propTypes = {
  staffSlips: PropTypes.arrayOf(PropTypes.object),
};

export default StaffSlipEditList;
