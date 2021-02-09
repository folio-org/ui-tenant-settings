import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import {
  cloneDeep,
  find,
  isEmpty,
  omit,
  get,
  forEach,
} from 'lodash';
import queryString from 'query-string';

import {
  SearchAndSortQuery,
  buildUrl,
} from '@folio/stripes/smart-components';
import {
  Select,
  Button,
  Headline,
  Row,
  Col,
  Pane,
  Paneset,
  MultiColumnList,
  Layer,
  Callout,
} from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { SORT_TYPES } from '../../constants';
import LocationDetail from './LocationDetail';
import EditForm from './LocationForm';
import { RemoteStorageApiProvider } from './RemoteStorage';

class LocationManager extends React.Component {
  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
    },
    uniquenessValidator: {
      type: 'okapi',
      records: 'locations',
      accumulate: 'true',
      path: 'locations',
      fetch: false,
    },
    institutions: {
      type: 'okapi',
      path: 'location-units/institutions',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'locinsts',
      accumulate: true,
    },
    campuses: {
      type: 'okapi',
      path: 'location-units/campuses',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'loccamps',
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
    servicePoints: {
      type: 'okapi',
      records: 'servicepoints',
      path: 'service-points',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      resourceShouldRefresh: true,
    },
    holdingsEntries: {
      type: 'okapi',
      path: 'holdings-storage/holdings',
      records: 'holdingsRecords',
      accumulate: true,
    },
    itemEntries: {
      type: 'okapi',
      path: 'inventory/items',
      records: 'items',
      accumulate: true,
    },
  });

  static propTypes = {
    intl: PropTypes.object,
    label: PropTypes.node.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    resources: PropTypes.shape({
      entries: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
      servicePoints: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
      institutions: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
      campuses: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
      libraries: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    }).isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
      servicePoints: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
      institutions: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      campuses: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      libraries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      holdingsEntries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      itemEntries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      uniquenessValidator: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasInterface: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      institutionId: '',
      campusId: '',
      libraryId: '',
      servicePointsById: {},
      servicePointsByName: {},
      selectedId: this.initialSelectedLocationId,
      ...this.initialSort,
    };

    this.callout = React.createRef();

    const { formatMessage } = props.intl;

    this.entryLabel = formatMessage({ id: 'ui-tenant-settings.settings.location.locations.location' });
    this.locationListVisibleColumns = ['isActive', 'name', 'code'];
    this.locationListColumnMapping = {
      isActive: formatMessage({ id: 'ui-tenant-settings.settings.location.locations.status' }),
      name: formatMessage({ id: 'ui-tenant-settings.settings.location.locations.detailsName' }),
      code: formatMessage({ id: 'ui-tenant-settings.settings.location.code' }),
    };
    this.locationListFormatter = {
      isActive: item => {
        const locationId = item.isActive ? 'active' : 'inactive';

        return formatMessage({ id: `ui-tenant-settings.settings.location.locations.${locationId}` });
      }
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { resources } = nextProps;
    const servicePointsByName = {};
    if (resources.servicePoints && resources.servicePoints.hasLoaded) {
      const servicePointsById = ((resources.servicePoints || {}).records || []).reduce((map, item) => {
        map[item.id] = item.name;
        servicePointsByName[item.name] = item.id;
        return map;
      }, {});
      return { servicePointsById, servicePointsByName };
    }
    return null;
  }

  /**
   * Refresh lookup tables when the component mounts. Fetches in the manifest
   * will only run once (in the constructor) but because this object may be
   * unmounted/remounted without being destroyed/recreated, the lookup tables
   * will be stale if they change between unmounting/remounting.
   */
  componentDidMount() {
    ['institutions', 'campuses', 'libraries'].forEach(i => {
      this.props.mutator[i].reset();
      this.props.mutator[i].GET();
    });
  }

  get initialSelectedLocationId() {
    const { location } = this.props;

    const idFromPathnameRe = '/([^/]+)$';
    const reMatches = new RegExp(idFromPathnameRe).exec(location.pathname);

    return reMatches ? reMatches[1] : null;
  }

  get initialSort() {
    const { location: { search } } = this.props;

    const {
      sort = 'name',
      sortDir = SORT_TYPES.ASCENDING,
    } = queryString.parse(search.slice(1));

    return {
      sort,
      sortDir,
    };
  }

  onSort = (e, { name: fieldName }) => {
    const {
      sort,
      sortDir,
    } = this.state;

    const isSameField = sort === fieldName;
    let newSortDir = SORT_TYPES.ASCENDING;

    if (isSameField) {
      newSortDir = newSortDir === sortDir ? SORT_TYPES.DESCENDING : newSortDir;
    }

    const sortState = {
      sort: fieldName,
      sortDir: newSortDir,
    };

    this.setState(sortState);
    this.transitionToParams(sortState);
  };

  onSelectRow = (e, meta) => {
    const { match: { path } } = this.props;

    this.transitionToParams({ _path: `${path}/${meta.id}` });
    this.setState({ selectedId: meta.id });
  };

  transitionToParams(values) {
    const {
      location,
      history,
    } = this.props;

    const url = buildUrl(location, values);

    history.push(url);
  }

  onChangeInstitution = (e) => {
    this.setState({
      institutionId: e.target.value,
      campusId: '',
      libraryId: '',
    });
  };

  onChangeCampus = (e) => {
    this.setState({
      campusId: e.target.value,
      libraryId: '',
    });
  };

  onChangeLibrary = (e) => {
    this.setState({ libraryId: e.target.value });
  };

  renderFilter() {
    const {
      resources,
      location,
      intl: { formatMessage },
    } = this.props;
    const {
      institutionId,
      campusId,
      libraryId,
    } = this.state;

    const institutions = get(resources.institutions, 'records', [])
      .map(institution => ({
        value: institution.id,
        label: this.formatLocationDisplayName(institution),
      }));

    if (isEmpty(institutions)) {
      return <div />;
    }

    const campuses = get(resources.campuses, 'records', [])
      .filter(campus => campus.institutionId === institutionId)
      .map(campus => ({
        value: campus.id,
        label: this.formatLocationDisplayName(campus),
      }));

    const libraries = get(resources.libraries, 'records', [])
      .filter(library => library.campusId === campusId)
      .map(library => ({
        value: library.id,
        label: this.formatLocationDisplayName(library),
      }));

    return (
      <div>
        <div data-test-institution-select>
          <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
            id="institutionSelect"
            name="institutionSelect"
            value={institutionId}
            dataOptions={[{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.institutions.selectInstitution' }), value: '' }, ...institutions]}
            onChange={this.onChangeInstitution}
          />
        </div>
        <div data-test-campus-select>
          {institutionId && <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
            id="campusSelect"
            name="campusSelect"
            value={campusId}
            dataOptions={[{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.campuses.selectCampus' }), value: '' }, ...campuses]}
            onChange={this.onChangeCampus}
          />}
        </div>
        <div data-test-library-select>
          {campusId && <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />}
            id="librarySelect"
            name="campusSelect"
            value={libraryId}
            dataOptions={[{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.libraries.selectLibrary' }), value: '' }, ...libraries]}
            onChange={this.onChangeLibrary}
          />}
        </div>
        <Row between="xs">
          <Col xs>
            <Headline size="medium" margin="none"><FormattedMessage id="ui-tenant-settings.settings.location.locations" /></Headline>
          </Col>
          <Col xs>
            <Row end="xs">
              <Col xs>
                <Button
                  id="clickable-add-location"
                  to={buildUrl(location, { layer: 'add' })}
                  marginBottom0
                >
                  <FormattedMessage id="stripes-components.button.new" />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        {!libraryId &&
          <FormattedMessage
            id="ui-tenant-settings.settings.location.locations.missingSelection"
            tagName="div"
          />
        }
      </div>
    );
  }

  formatLocationDisplayName(location) {
    return `${location.name}${location.code ? ` (${location.code})` : ''}`;
  }

  parseInitialValues(loc, cloning = false) {
    if (!loc) return loc;

    loc.detailsArray = Object.keys(loc.details || []).map(name => {
      return { name, value: loc.details[name] };
    }).sort();

    return cloning ? omit(loc, 'id') : loc;
  }

  handleDetailClose = () => {
    this.transitionToParams({ _path: this.props.match.path });
    this.setState({ selectedId: null });
  };

  prepareLocationsData() {
    const { resources } = this.props;
    const {
      sort,
      sortDir,
    } = this.state;

    const sortDirValue = sortDir === SORT_TYPES.ASCENDING ? 1 : -1;

    return cloneDeep((resources.entries || {}).records || []).map(location => {
      location.servicePointIds = (location.servicePointIds || []).map(id => ({
        selectSP: this.state.servicePointsById[id],
        primary: (location.primaryServicePoint === id),
      }));

      return location;
    }).sort((a, b) => sortDirValue * `${a[sort]}`.localeCompare(`${b[sort]}`));
  }

  onCancel = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: null });
  };

  handleDetailEdit = location => {
    this.setState({ selectedId: location.id });
    this.transitionToParams({ layer: 'edit' });
  };

  handleDetailClone = location => {
    this.setState({ selectedId: location.id });
    this.transitionToParams({ layer: 'clone' });
  };

  checkLocationHasHoldingsOrItems = async (locationId) => {
    const { mutator } = this.props;
    const query = `permanentLocationId=="${locationId}" or temporaryLocationId=="${locationId}"`;

    mutator.holdingsEntries.reset();
    mutator.itemEntries.reset();

    const results = await Promise.all([
      mutator.holdingsEntries.GET({ params: { query } }),
      mutator.itemEntries.GET({ params: { query } }),
    ]);

    return results.some(records => records.length > 0);
  };

  onRemove = location => {
    const {
      match,
      mutator,
    } = this.props;

    return this.checkLocationHasHoldingsOrItems(location.id)
      .then(hasSomething => !hasSomething && mutator.entries.DELETE(location))
      .then(result => {
        const isRemoved = (result !== false);

        if (isRemoved) {
          this.showCalloutMessage(location.name);
          this.transitionToParams({
            _path: `${match.path}`,
            layer: null
          });
        }

        return isRemoved;
      });
  };

  updateSelected = location => {
    this.transitionToParams({
      _path: `${this.props.match.path}/${location.id}`,
      layer: null,
    });
    this.setState({ selectedId: location.id });
  };

  showCalloutMessage(name) {
    if (!this.callout.current) return;

    const message = (
      <SafeHTMLMessage
        id="stripes-core.successfullyDeleted"
        values={{
          entry: this.entryLabel,
          name: name || '',
        }}
      />
    );

    this.callout.current.sendCallout({ message });
  }

  render() {
    const {
      match,
      label,
      location: { search },
      mutator,
    } = this.props;
    const {
      institutionId,
      campusId,
      libraryId,
      sort,
      sortDir,
      selectedId,
      servicePointsById,
      servicePointsByName,
    } = this.state;

    const locations = this.prepareLocationsData();
    const contentData = locations.filter(row => row.libraryId === libraryId);
    const query = queryString.parse(search);
    const defaultEntry = { isActive: true, institutionId, campusId, libraryId, servicePointIds: [{ selectSP: '', primary: true }] };
    const adding = search.match('layer=add');
    const cloning = search.match('layer=clone');

    // Providing default 'isActive' value is used here when the 'isActive' property is missing in the 'locations' loaded via the API.
    forEach(contentData, location => {
      if (location.isActive === undefined) {
        location.isActive = false;
      }
    });

    const selectedItem = (selectedId && !adding)
      ? find(contentData, entry => entry.id === selectedId) : defaultEntry;

    const initialValues = this.parseInitialValues(selectedItem, cloning);

    const container = document.getElementById('ModuleContainer');

    if (!container) return (<div />);

    return (
      <Paneset
        defaultWidth="fill"
        data-test-entry-manager
      >
        <Pane
          defaultWidth="fill"
          paneTitle={label}
        >
          <SearchAndSortQuery>
            {() => (
              <Fragment>
                {this.renderFilter()}
                <MultiColumnList
                  id="locations-list"
                  contentData={contentData}
                  visibleColumns={this.locationListVisibleColumns}
                  columnMapping={this.locationListColumnMapping}
                  formatter={this.locationListFormatter}
                  selectedRow={selectedItem}
                  sortOrder={sort}
                  sortDirection={sortDir}
                  isEmptyMessage={null}
                  onHeaderClick={this.onSort}
                  onRowClick={this.onSelectRow}
                />
              </Fragment>
            )}
          </SearchAndSortQuery>
        </Pane>
        <Route
          path={`${match.path}/:id`}
          render={
            () => {
              if (!selectedItem) return null;

              return (
                <RemoteStorageApiProvider>
                  <LocationDetail
                    initialValues={selectedItem}
                    servicePointsById={servicePointsById}
                    onEdit={this.handleDetailEdit}
                    onClone={this.handleDetailClone}
                    onClose={this.handleDetailClose}
                    onRemove={this.onRemove}
                  />
                </RemoteStorageApiProvider>
              );
            }
          }
        />
        <RemoteStorageApiProvider>
          <FormattedMessage
            id="stripes-core.label.editEntry"
            values={{ entry: this.entryLabel }}
          >
            {contentLabelChunks => (
              <Layer
                isOpen={Boolean(query.layer)}
                contentLabel={contentLabelChunks.join()}
                container={container}
              >
                <EditForm
                  parentMutator={mutator}
                  locationResources={this.props.resources}
                  servicePointsByName={servicePointsByName}
                  initialValues={initialValues}
                  onSave={this.updateSelected}
                  onCancel={this.onCancel}
                  checkLocationHasHoldingsOrItems={this.checkLocationHasHoldingsOrItems}
                />
              </Layer>
            )}
          </FormattedMessage>
        </RemoteStorageApiProvider>
        <Callout ref={this.callout} />
      </Paneset>
    );
  }
}

export default injectIntl(LocationManager);
// export default LocationManager;
