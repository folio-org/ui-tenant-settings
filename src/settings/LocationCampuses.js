import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  Select,
  TextLink,
} from '@folio/stripes/components';

import { TitleManager } from '@folio/stripes/core';
import locationCodeValidator from './locationCodeValidator';
import composeValidators from '../util/composeValidators';
import css from './LocationInstitutions.css';
import { CAMPUS_ID_LIBRARIES, INSTITUTION_ID_CAMPUS, INSTITUTION_ID_LIBRARIES } from '../constants';

const translations = {
  cannotDeleteTermHeader: 'ui-tenant-settings.settings.location.campuses.cannotDeleteTermHeader',
  cannotDeleteTermMessage: 'ui-tenant-settings.settings.location.campuses.cannotDeleteTermMessage',
  deleteEntry: 'ui-tenant-settings.settings.location.campuses.deleteEntry',
  termDeleted: 'ui-tenant-settings.settings.location.campuses.termDeleted',
  termWillBeDeleted: 'ui-tenant-settings.settings.location.campuses.termWillBeDeleted',
};

class LocationCampuses extends React.Component {
  static manifest = {
    institutions: {
      type: 'okapi',
      records: 'locinsts',
      path: 'location-units/institutions?query=cql.allRecords=1 sortby name&limit=100',
      accumulate: true,
    },
    libraries: {
      type: 'okapi',
      path: 'location-units/libraries',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'loclibs',
      accumulate: true,
    },
  };

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasPerm: PropTypes.func.isRequired
    }).isRequired,
    resources: PropTypes.shape({
      institutions: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      locationsPerCampus: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      libraries: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      })
    }),
    intl: PropTypes.object,
    mutator: PropTypes.shape({
      institutions: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      locationsPerCampus: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
    this.hasAllLocationPerms = props.stripes.hasPerm('ui-tenant-settings.settings.location');
    this.numberOfObjectsFormatter = this.numberOfObjectsFormatter.bind(this);

    this.state = {
      institutionId: null,
    };
  }

  /**
   * Refresh lookup tables when the component mounts. Fetches in the manifest
   * will only run once (in the constructor) but because this object may be
   * unmounted/remounted without being destroyed/recreated, the lookup tables
   * will be stale if they change between unmounting/remounting.
   */
  componentDidMount() {
    const institutionId = sessionStorage.getItem(INSTITUTION_ID_CAMPUS);
    this.setState({ institutionId });
    ['institutions', 'libraries'].forEach(i => {
      this.props.mutator[i].reset();
      this.props.mutator[i].GET();
    });
  }

  numberOfObjectsFormatter = (item) => {
    const records = (this.props.resources.libraries || {}).records || [];
    const numberOfObjects = records.reduce((count, loc) => {
      return loc.campusId === item.id ? count + 1 : count;
    }, 0);

    const onNumberOfObjectsClick = () => {
      sessionStorage.setItem(INSTITUTION_ID_LIBRARIES, this.state.institutionId);
      sessionStorage.setItem(CAMPUS_ID_LIBRARIES, item.id);
    };

    return (
      <TextLink
        onClick={onNumberOfObjectsClick}
        className={css.numberOfObjectsWrapper}
        data-testid={item.id}
        to="./location-libraries"
      >
        {numberOfObjects}
      </TextLink>);
  }

  onChangeInstitution = (e) => {
    const value = e.target.value;
    this.setState({ institutionId: value });

    sessionStorage.setItem(INSTITUTION_ID_CAMPUS, value);
  }

  render() {
    const institutions = [];
    (((this.props.resources.institutions || {}).records || []).forEach(i => {
      institutions.push(
        <option value={i.id} key={i.id}>
          {i.name}
          {i.code ? ` (${i.code})` : ''}
        </option>
      );
    }));

    if (!institutions.length) {
      return <div data-testid="institutuins-empty" />;
    }

    const rowFilter = (
      <Select
        label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
        id="institutionSelect"
        name="institutionSelect"
        onChange={this.onChangeInstitution}
        value={this.state.institutionId}
      >
        <FormattedMessage id="ui-tenant-settings.settings.location.institutions.selectInstitution">
          {selectText => (
            <option>{selectText}</option>
          )}
        </FormattedMessage>
        {institutions}
      </Select>
    );

    return (
      <TitleManager page={this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.location.campuses.title' })}>
        <this.connectedControlledVocab
          {...this.props}
        // We have to unset the dataKey to prevent the props.resources in
        // <ControlledVocab> from being overwritten by the props.resources here.
          dataKey={undefined}
          baseUrl="location-units/campuses"
          records="loccamps"
          rowFilter={rowFilter}
          rowFilterFunction={(row) => row.institutionId === this.state.institutionId}
          label={this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.location.campuses' })}
          translations={translations}
          objectLabel={<FormattedMessage id="ui-tenant-settings.settings.location.libraries" />}
          visibleFields={['name', 'code']}
          columnMapping={{
            name: <FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />,
            code: <FormattedMessage id="ui-tenant-settings.settings.location.code" />,
          }}
          formatter={{ numberOfObjects: this.numberOfObjectsFormatter }}
          nameKey="group"
          id="campuses"
          preCreateHook={(item) => ({ ...item, institutionId: this.state.institutionId })}
          listSuppressor={() => !this.state.institutionId}
          listSuppressorText={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.missingSelection" />}
          sortby="name"
          validate={composeValidators(locationCodeValidator.validate)}
          editable={this.hasAllLocationPerms}
          canCreate={this.hasAllLocationPerms}
        />
      </TitleManager>
    );
  }
}

export default injectIntl(LocationCampuses);
