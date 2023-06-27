import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { get } from 'lodash';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { Select } from '@folio/stripes/components';

import { TextLink } from '@folio/stripes-components';
import composeValidators from '../util/composeValidators';
import locationCodeValidator from './locationCodeValidator';
import {
  CAMPUS_ID_LIBRARIES,
  INSTITUTION_ID_LIBRARIES,
  LOCATION_CAMPUS_ID_KEY,
  LOCATION_INSTITUTION_ID_KEY,
  LOCATION_LIBRARY_ID_KEY
} from '../constants';
import css from './LocationInstitutions.css';

const translations = {
  cannotDeleteTermHeader: 'ui-tenant-settings.settings.location.libraries.cannotDeleteTermHeader',
  cannotDeleteTermMessage: 'ui-tenant-settings.settings.location.libraries.cannotDeleteTermMessage',
  deleteEntry: 'ui-tenant-settings.settings.location.libraries.deleteEntry',
  termDeleted: 'ui-tenant-settings.settings.location.libraries.termDeleted',
  termWillBeDeleted: 'ui-tenant-settings.settings.location.libraries.termWillBeDeleted',
};

class LocationLibraries extends React.Component {
  static manifest = Object.freeze({
    institutions: {
      type: 'okapi',
      records: 'locinsts',
      path: 'location-units/institutions?query=cql.allRecords=1 sortby name&limit=100',
      accumulate: true,
    },
    campuses: {
      type: 'okapi',
      records: 'loccamps',
      path: 'location-units/campuses?query=cql.allRecords=1 sortby name&limit=100',
      accumulate: true,
    },
    locationsPerLibrary: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '10000',
      },
      accumulate: true,
    },
  });

  static propTypes = {
    intl: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasPerm: PropTypes.bool.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      institutions: PropTypes.object,
      campuses: PropTypes.object,
      locationsPerLibrary: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      institutions: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      campuses: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      locationsPerLibrary: PropTypes.shape({
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
      campusId: null,
    };
  }

  /**
   * Refresh lookup tables when the component mounts. Fetches in the manifest
   * will only run once (in the constructor) but because this object may be
   * unmounted/remounted without being destroyed/recreated, the lookup tables
   * will be stale if they change between unmounting/remounting.
   */
  componentDidMount() {
    const institutionId = sessionStorage.getItem(INSTITUTION_ID_LIBRARIES);
    const campusId = sessionStorage.getItem(CAMPUS_ID_LIBRARIES);
    this.setState({ institutionId, campusId });
    ['institutions', 'campuses', 'locationsPerLibrary'].forEach(i => {
      this.props.mutator[i].reset();
      this.props.mutator[i].GET();
    });
  }

  numberOfObjectsFormatter = (item) => {
    const records = (this.props.resources.locationsPerLibrary || {}).records || [];
    const numberOfObjects = records.reduce((count, loc) => {
      return loc.libraryId === item.id ? count + 1 : count;
    }, 0);

    const onNumberOfObjectsClick = () => {
      sessionStorage.setItem(LOCATION_LIBRARY_ID_KEY, item.id);
      sessionStorage.setItem(LOCATION_INSTITUTION_ID_KEY, this.state.institutionId);
      sessionStorage.setItem(LOCATION_CAMPUS_ID_KEY, this.state.campusId);
    };

    return (
      <TextLink
        onClick={onNumberOfObjectsClick}
        className={css.numberOfObjectsWrapper}
        data-testid={item.id}
        to="./location-locations"
      >
        {numberOfObjects}
      </TextLink>);
  }

  onChangeInstitution = (e) => {
    const value = e.target.value;
    this.setState({ institutionId: value, campusId: null });

    sessionStorage.setItem(INSTITUTION_ID_LIBRARIES, value);
  }

  onChangeCampus = (e) => {
    const value = e.target.value;
    this.setState({ campusId: value });

    sessionStorage.setItem(CAMPUS_ID_LIBRARIES, value);
  }

  render() {
    const { institutionId, campusId } = this.state;
    const { resources } = this.props;

    const institutions = get(resources, 'institutions.records', []).map(i => (
      <option value={i.id} key={i.id}>
        {i.name}
        {i.code ? ` (${i.code})` : ''}
      </option>
    ));

    if (!institutions.length) {
      return <div data-testid="libraries-empty" />;
    }

    const campuses = [];

    get(resources, 'campuses.records', []).forEach(c => {
      if (c.institutionId === institutionId) {
        campuses.push(
          <option value={c.id} key={c.id}>
            {c.name}
            {c.code ? ` (${c.code})` : ''}
          </option>
        );
      }
    });

    const formatter = {
      numberOfObjects: this.numberOfObjectsFormatter,
    };

    const filterBlock = (
      <>
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
        {institutionId &&
          <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
            id="campusSelect"
            name="campusSelect"
            onChange={this.onChangeCampus}
            value={this.state.campusId}
          >
            <FormattedMessage id="ui-tenant-settings.settings.location.campuses.selectCampus">
              {selectText => (
                <option>{selectText}</option>
              )}
            </FormattedMessage>
            {campuses}
          </Select>
        }
      </>
    );

    return (
      <this.connectedControlledVocab
        {...this.props}
        // We have to unset the dataKey to prevent the props.resources in
        // <ControlledVocab> from being overwritten by the props.resources here.
        dataKey={undefined}
        baseUrl="location-units/libraries"
        records="loclibs"
        rowFilter={filterBlock}
        rowFilterFunction={(row) => row.campusId === campusId}
        label={this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.location.libraries' })}
        translations={translations}
        objectLabel={<FormattedMessage id="ui-tenant-settings.settings.location.locations" />}
        visibleFields={['name', 'code']}
        columnMapping={{
          name: <FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />,
          code: <FormattedMessage id="ui-tenant-settings.settings.location.code" />,
        }}
        formatter={formatter}
        nameKey="group"
        id="libraries"
        preCreateHook={(item) => ({ ...item, campusId })}
        listSuppressor={() => !(institutionId && campusId)}
        listSuppressorText={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.missingSelection" />}
        sortby="name"
        validate={composeValidators(locationCodeValidator.validate)}
        editable={this.hasAllLocationPerms}
        canCreate={this.hasAllLocationPerms}
      />
    );
  }
}

export default injectIntl(LocationLibraries);
