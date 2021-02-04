import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useIntl } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Checkbox,
  Col,
  Label,
  Row,
  Select,
  TextField,
  Timepicker,
} from '@folio/stripes/components';

import {
  SCHEDULE_PERIODS,
  WEEKDAYS,
} from './constants';
import { validateRequired } from './validation';

export const BursarExportsConfigurationForm = ({
  form,
  handleSubmit,
  onFormStateChanged,
  pristine,
  submitting,
}) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    onFormStateChanged(form);
  }, [pristine, submitting]);

  const schedulePeriodOptions = useMemo(() => (
    Object.keys(SCHEDULE_PERIODS)
      .map(periodKey => ({
        label: formatMessage({
          id: `ui-tenant-settings.settings.bursarExports.schedulePeriod.${periodKey}`,
        }),
        value: SCHEDULE_PERIODS[periodKey],
      }))
  ), []);

  const formValues = form.getState()?.values || {};

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Col xs={4}>
          <Field
            data-testid="schedule-period"
            label={formatMessage({
              id: 'ui-tenant-settings.settings.bursarExports.schedulePeriod'
            })}
            name="schedulePeriod"
            component={Select}
            dataOptions={schedulePeriodOptions}
            onChange={form.mutators.changeSchedulePeriod}
            required
          />
        </Col>

        {
          Boolean(formValues.schedulePeriod) && (
            <Col xs={4}>
              <Field
                data-testid="schedule-frequency"
                component={TextField}
                label={formatMessage({
                  id: 'ui-tenant-settings.settings.bursarExports.scheduleFrequency'
                })}
                name="scheduleFrequency"
                type="number"
                min={1}
                hasClearIcon={false}
                required
                validate={validateRequired}
              />
            </Col>
          )
        }
      </Row>

      {
        formValues.schedulePeriod === SCHEDULE_PERIODS.weeks && (
          <>
            <Label required>
              {formatMessage({
                id: 'ui-tenant-settings.settings.bursarExports.scheduleWeekdays'
              })}
            </Label>

            <FieldArray name="scheduleWeekdays">
              {
                ({ fields }) => WEEKDAYS.map((weekday, index) => (
                  <Field
                    key={index}
                    component={Checkbox}
                    label={formatMessage({
                      id: `ui-tenant-settings.settings.bursarExports.scheduleWeekdays.${weekday}`
                    })}
                    name={`${fields.name}[${weekday}]`}
                    type="checkbox"
                    vertical
                  />
                ))
              }
            </FieldArray>
          </>
        )
      }

      {
        [SCHEDULE_PERIODS.days, SCHEDULE_PERIODS.weeks].includes(formValues.schedulePeriod) && (
          <Row>
            <Col xs={4}>
              <Field
                data-testid="schedule-time"
                component={Timepicker}
                label={formatMessage({
                  id: 'ui-tenant-settings.settings.bursarExports.scheduleTime'
                })}
                name="scheduleTime"
                required
                validate={validateRequired}
              />
            </Col>
          </Row>
        )
      }

      <Row>
        <Col xs={8}>
          <Field
            component={TextField}
            label={formatMessage({
              id: 'ui-tenant-settings.settings.bursarExports.ftpAddress'
            })}
            name="ftpAddress"
            type="text"
            required
            validate={validateRequired}
          />
        </Col>
      </Row>
    </form>
  );
};

BursarExportsConfigurationForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onFormStateChanged: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

export const BursarExportsConfiguration = stripesFinalForm({
  subscription: { values: true },
  navigationCheck: true,
  mutators: {
    changeSchedulePeriod: (args, state, utils) => {
      const nextValue = args[0].target.value;
      const prevValue = state.formState.values.schedulePeriod;

      utils.changeValue(state, 'schedulePeriod', () => nextValue);

      if (nextValue && !prevValue) {
        utils.changeValue(state, 'scheduleFrequency', () => 1);
      }

      if (prevValue === SCHEDULE_PERIODS.weeks) {
        utils.changeValue(state, 'scheduleWeekdays', () => undefined);
      }

      if ([SCHEDULE_PERIODS.none, SCHEDULE_PERIODS.hours].includes(nextValue)) {
        utils.changeValue(state, 'scheduleTime', () => undefined);
      }

      if (!nextValue) {
        utils.changeValue(state, 'scheduleFrequency', () => undefined);
      }
    },
  },
})(BursarExportsConfigurationForm);
