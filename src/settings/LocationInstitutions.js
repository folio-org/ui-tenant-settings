import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';

import composeValidators from '../util/composeValidators';
import locationCodeValidator from './locationCodeValidator';
import css from './LocationInstitutions.css';

const translations = {
  cannotDeleteTermHeader: 'ui-tenant-settings.settings.location.institutions.cannotDeleteTermHeader',
  cannotDeleteTermMessage: 'ui-tenant-settings.settings.location.institutions.cannotDeleteTermMessage',
  deleteEntry: 'ui-tenant-settings.settings.location.institutions.deleteEntry',
  termDeleted: 'ui-tenant-settings.settings.location.institutions.termDeleted',
  termWillBeDeleted: 'ui-tenant-settings.settings.location.institutions.termWillBeDeleted',
};

class LocationInstitutions extends React.Component {
  static manifest = Object.freeze({
    locationsPerInstitution: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '500',
      },
      accumulate: true,
    },
    campuses: {
      type: 'okapi',
      records: 'loccamps',
      path: 'location-units/campuses?query=cql.allRecords=1 sortby name&limit=2000',
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
      locationsPerInstitution: PropTypes.object,
      campuses: PropTypes.object,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func,
    }),
    mutator: PropTypes.shape({
      campuses: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.hasAllLocationPerms = props.stripes.hasPerm('ui-tenant-settings.settings.location');
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
    this.numberOfObjectsFormatter = this.numberOfObjectsFormatter.bind(this);
  }

  /**
   * Refresh lookup tables when the component mounts. Fetches in the manifest
   * will only run once (in the constructor) but because this object may be
   * unmounted/remounted without being destroyed/recreated, the lookup tables
   * will be stale if they change between unmounting/remounting.
   */
  componentDidMount() {
    this.props.mutator.campuses.reset();
    this.props.mutator.campuses.GET();
  }

  numberOfObjectsFormatter = (item) => {
    const records = (this.props.resources.campuses || {}).records || [];
    const numberOfObjects = records.reduce((count, loc) => {
      return loc.institutionId === item.id ? count + 1 : count;
    }, 0);

    const onNumberOfObjectsClick = () => {
      this.props.history.replace({
        pathname: 'location-campuses'
      });

      sessionStorage.setItem('institutionIdCampuses', item.id);
    };

    return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <div onClick={onNumberOfObjectsClick} className={css.numberOfObjectsWrapper}>
        <FormattedMessage
          id="ui-tenant-settings.settings.location.institutions.number"
          values={{
            number: numberOfObjects
          }}
        />
      </div>);
  }

  render() {
    const formatter = {
      numberOfObjects: this.numberOfObjectsFormatter,
    };

    return (
      <this.connectedControlledVocab
        {...this.props}
        // We have to unset the dataKey to prevent the props.resources in
        // <ControlledVocab> from being overwritten by the props.resources here.
        dataKey={undefined}
        baseUrl="location-units/institutions"
        records="locinsts"
        label={this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.location.institutions' })}
        translations={translations}
        objectLabel={<FormattedMessage id="ui-tenant-settings.settings.location.campuses" />}
        visibleFields={['name', 'code']}
        columnMapping={{
          name: <FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />,
          code: <FormattedMessage id="ui-tenant-settings.settings.location.code" />,
        }}
        formatter={formatter}
        nameKey="name"
        id="institutions"
        sortby="name"
        validate={composeValidators(locationCodeValidator.validate)}
        editable={this.hasAllLocationPerms}
        canCreate={this.hasAllLocationPerms}
      />
    );
  }
}

export default injectIntl(LocationInstitutions);
