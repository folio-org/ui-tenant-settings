import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  useHistory,
  useLocation,
  useRouteMatch
} from 'react-router-dom';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  cloneDeep,
  find,
  isEmpty,
  omit,
  forEach,
} from 'lodash';
import queryString from 'query-string';
import { useQueryClient } from 'react-query';

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
import {
  TitleManager,
  useOkapiKy,
  useStripes
} from '@folio/stripes/core';

import {
  LOCATION_CAMPUS_ID_KEY,
  LOCATION_INSTITUTION_ID_KEY,
  LOCATION_LIBRARY_ID_KEY,
  SORT_TYPES
} from '../../constants';
import LocationDetail from './LocationDetail';
import EditForm from './LocationForm';
import { RemoteStorageApiProvider } from './RemoteStorage';
import { useInstitutions } from '../../hooks/useInstitutions';
import { useLibraries } from '../../hooks/useLibraries';
import { useCampuses } from '../../hooks/useCampuses';
import { SERVICE_POINTS, useServicePoints } from '../../hooks/useServicePoints';
import { LOCATIONS, useLocations } from '../../hooks/useLocations';
import { useLocationDelete } from '../../hooks/useLocationDelete';


const initialSelectedLocationId = (location) => {
  const idFromPathnameRe = '/([^/]+)$';
  const reMatches = new RegExp(idFromPathnameRe).exec(location.pathname);
  return reMatches ? reMatches[1] : null;
};

const initialSort = (location) => {
  const { sort = 'name', sortDir = SORT_TYPES.ASCENDING } = queryString.parse(location.search.slice(1));
  return { sort, sortDir };
};

const locationListVisibleColumns = ['isActive', 'name', 'code'];

const locationListColumnMapping = {
  isActive: <FormattedMessage id="ui-tenant-settings.settings.location.locations.status" />,
  name: <FormattedMessage id="ui-tenant-settings.settings.location.locations.detailsName" />,
  code: <FormattedMessage id="ui-tenant-settings.settings.location.code" />,
};

const locationListFormatter = {
  isActive: item => {
    const locationId = item.isActive ? 'active' : 'inactive';
    return <FormattedMessage id={`ui-tenant-settings.settings.location.locations.${locationId}`} />;
  }
};

const LocationManager = ({ label }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const queryClient = useQueryClient();
  const ky = useOkapiKy();
  const callout = useRef(null);
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const entryLabel = intl.formatMessage({ id: 'ui-tenant-settings.settings.location.locations.location' });
  const hasAllLocationPerms = stripes.hasPerm('ui-tenant-settings.settings.location');

  const showCalloutMessage = (name) => {
    if (!callout.current) return;
    const message = (
      <FormattedMessage
        id="stripes-core.successfullyDeleted"
        values={{
          entry: entryLabel,
          name: name || '',
        }}
      />
    );
    callout.current.sendCallout({ message });
  };

  const [institutionId, setInstitutionId] = useState(sessionStorage.getItem(LOCATION_INSTITUTION_ID_KEY) || '');
  const [campusId, setCampusId] = useState(sessionStorage.getItem(LOCATION_CAMPUS_ID_KEY) || '');
  const [libraryId, setLibraryId] = useState(sessionStorage.getItem(LOCATION_LIBRARY_ID_KEY) || '');
  const [selectedId, setSelectedId] = useState(initialSelectedLocationId(location));
  const [sortState, setSortState] = useState(initialSort(location));

  const { institutions } = useInstitutions({ searchParams: {
    limit: 100,
    query: 'cql.allRecords=1 sortby name',
  } });

  const { libraries } = useLibraries({ searchParams: {
    limit: 1000,
    query: 'cql.allRecords=1 sortby name',
  } });

  const { campuses } = useCampuses({ searchParams: {
    limit: 1000,
    query: 'cql.allRecords=1 sortby name',
  } });

  const { servicePoints } = useServicePoints({ searchParams: {
    limit: 1000,
    query: 'cql.allRecords=1 sortby name',
  } });

  const { locations: locationEntries, refetch: refetchLocationEntries } = useLocations({
    searchParams: {
      limit: 3000,
      query: 'cql.allRecords=1 sortby name'
    },
  });

  const { deleteLocation } = useLocationDelete({
    onSuccess: () => {
      queryClient.invalidateQueries(SERVICE_POINTS);
      queryClient.invalidateQueries(LOCATIONS);
    }
  });

  const { servicePointsById, servicePointsByName } = servicePoints.reduce((acc, item) => {
    acc.servicePointsById[item.id] = item.name;
    acc.servicePointsByName[item.name] = item.id;

    return acc;
  }, { servicePointsById: {}, servicePointsByName: {} });

  const transitionToParams = (values) => {
    const url = buildUrl(location, values);
    history.push(url);
  };

  const formatLocationDisplayName = (loc) => {
    let lbl = loc.name;

    if (loc.code) {
      lbl += ` (${loc.code})`;
    }

    return lbl;
  };

  const onSort = (e, { name: fieldName }) => {
    const { sort, sortDir } = sortState;
    const isSameField = sort === fieldName;
    let newSortDir = SORT_TYPES.ASCENDING;
    if (isSameField) {
      newSortDir = newSortDir === sortDir ? SORT_TYPES.DESCENDING : newSortDir;
    }
    const newSortState = { sort: fieldName, sortDir: newSortDir };
    setSortState(newSortState);
    transitionToParams(newSortState);
  };

  const onSelectRow = (e, meta) => {
    transitionToParams({ _path: `${match.path}/${meta.id}` });
    setSelectedId(meta.id);
  };

  const onChangeInstitution = (e) => {
    const newInstitutionId = e.target.value;
    sessionStorage.setItem(LOCATION_INSTITUTION_ID_KEY, newInstitutionId);
    sessionStorage.setItem(LOCATION_CAMPUS_ID_KEY, '');
    sessionStorage.setItem(LOCATION_LIBRARY_ID_KEY, '');
    setInstitutionId(newInstitutionId);
    setCampusId('');
    setLibraryId('');
  };

  const onChangeCampus = (e) => {
    const newCampusId = e.target.value;
    sessionStorage.setItem(LOCATION_CAMPUS_ID_KEY, newCampusId);
    setCampusId(newCampusId);
    setLibraryId('');
  };

  const onChangeLibrary = (e) => {
    const newLibraryId = e.target.value;
    sessionStorage.setItem(LOCATION_LIBRARY_ID_KEY, newLibraryId);
    setLibraryId(newLibraryId);
  };

  const renderFilter = () => {
    const formattedInstitutions = institutions
      .map(institution => ({
        value: institution.id,
        label: formatLocationDisplayName(institution),
      }));

    if (isEmpty(formattedInstitutions)) {
      return <div />;
    }

    const formattedCampuses = campuses
      .filter(campus => campus.institutionId === institutionId)
      .map(campus => ({
        value: campus.id,
        label: formatLocationDisplayName(campus),
      }));

    const formattedLibraries = libraries
      .filter(library => library.campusId === campusId)
      .map(library => ({
        value: library.id,
        label: formatLocationDisplayName(library),
      }));

    return (
      <div>
        <div data-test-institution-select>
          <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
            id="institutionSelect"
            name="institutionSelect"
            value={institutionId}
            dataOptions={[{ label: intl.formatMessage({ id: 'ui-tenant-settings.settings.location.institutions.selectInstitution' }), value: '' }, ...formattedInstitutions]}
            onChange={onChangeInstitution}
          />
        </div>
        <div data-test-campus-select>
          {institutionId && <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
            id="campusSelect"
            name="campusSelect"
            value={campusId}
            dataOptions={[{ label: intl.formatMessage({ id: 'ui-tenant-settings.settings.location.campuses.selectCampus' }), value: '' }, ...formattedCampuses]}
            onChange={onChangeCampus}
          />}
        </div>
        <div data-test-library-select>
          {campusId && <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />}
            id="librarySelect"
            name="librarySelect"
            value={libraryId}
            dataOptions={[{ label: intl.formatMessage({ id: 'ui-tenant-settings.settings.location.libraries.selectLibrary' }), value: '' }, ...formattedLibraries]}
            onChange={onChangeLibrary}
          />}
        </div>
        <Row between="xs">
          <Col xs>
            <Headline size="medium" margin="none"><FormattedMessage id="ui-tenant-settings.settings.location.locations" /></Headline>
          </Col>
          {hasAllLocationPerms && (
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
          )}
        </Row>
        {!libraryId &&
          <FormattedMessage
            id="ui-tenant-settings.settings.location.locations.missingSelection"
            tagName="div"
          />
        }
      </div>
    );
  };

  const parseInitialValues = (loc, cloning = false) => {
    if (!loc) return loc;
    loc.detailsArray = Object.keys(loc.details || []).map(name => ({ name, value: loc.details[name] }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return cloning ? omit(loc, 'id') : loc;
  };

  const handleDetailClose = () => {
    transitionToParams({ _path: match.path });
    setSelectedId(null);
    refetchLocationEntries();
  };

  const prepareLocationsData = () => {
    const { sort, sortDir } = sortState;
    const sortDirValue = sortDir === SORT_TYPES.ASCENDING ? 1 : -1;
    return cloneDeep((locationEntries)).map(loc => {
      loc.servicePointIds = (loc.servicePointIds || []).map(id => ({
        selectSP: servicePointsById[id],
        primary: (loc.primaryServicePoint === id),
      }));

      return loc;
    }).sort((a, b) => sortDirValue * `${a[sort]}`.localeCompare(`${b[sort]}`));
  };

  const onCancel = (e) => {
    if (e) {
      e.preventDefault();
    }
    transitionToParams({ layer: null });
  };

  const handleDetailEdit = loc => {
    setSelectedId(loc.id);
    transitionToParams({ layer: 'edit' });
  };

  const handleDetailClone = loc => {
    setSelectedId(loc.id);
    transitionToParams({ layer: 'clone' });
  };

  const checkLocationHasHoldingsOrItems = async (locationId) => {
    const query = `permanentLocationId=="${locationId}" or temporaryLocationId=="${locationId}"`;

    const results = await Promise.all([
      ky.get('inventory/items', { searchParams: { query } }).json(),
      ky.get('holdings-storage/holdings', { searchParams: { query } }).json(),
    ]);

    return results.some(records => records.length > 0);
  };

  const onRemove = loc => {
    return checkLocationHasHoldingsOrItems(loc.id)
      .then(hasSomething => !hasSomething && deleteLocation({ locationId: loc.id }))
      .then(result => {
        const isRemoved = (result !== false);
        if (isRemoved) {
          showCalloutMessage(loc.name);
          transitionToParams({
            _path: `${match.path}`,
            layer: null
          });
        }
        return isRemoved;
      });
  };

  const updateSelected = loc => {
    transitionToParams({
      _path: `${match.path}/${loc.id}`,
      layer: null,
    });
    setSelectedId(loc.id);
  };

  const locations = prepareLocationsData();
  const contentData = locations.filter(row => row.libraryId === libraryId);
  const query = queryString.parse(location.search);
  const defaultEntry = { isActive: true, institutionId, campusId, libraryId, servicePointIds: [{ selectSP: '', primary: true }] };
  const adding = location.search.match('layer=add');
  const cloning = location.search.match('layer=clone');

  forEach(contentData, loc => {
    if (loc.isActive === undefined) {
      loc.isActive = false;
    }
  });

  const selectedItem = (selectedId && !adding) ? find(contentData, entry => entry.id === selectedId) : defaultEntry;
  const initialValues = parseInitialValues(selectedItem, cloning);

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
            <>
              <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.location.locations.title' })}>
                {renderFilter()}
                <MultiColumnList
                  id="locations-list"
                  contentData={contentData}
                  visibleColumns={locationListVisibleColumns}
                  columnMapping={locationListColumnMapping}
                  formatter={locationListFormatter}
                  selectedRow={selectedItem}
                  sortOrder={sortState.sort}
                  sortDirection={sortState.sortDir}
                  isEmptyMessage={null}
                  onHeaderClick={onSort}
                  onRowClick={onSelectRow}
                />
              </TitleManager>
            </>
          )}
        </SearchAndSortQuery>
      </Pane>
      <Route
        path={`${match.path}/:id`}
        render={() => {
          if (!selectedItem) return null;
          return (
            <RemoteStorageApiProvider>
              <LocationDetail
                initialValues={selectedItem}
                servicePointsById={servicePointsById}
                onEdit={handleDetailEdit}
                onClone={handleDetailClone}
                onClose={handleDetailClose}
                onRemove={onRemove}
              />
            </RemoteStorageApiProvider>
          );
        }}
      />
      <RemoteStorageApiProvider>
        <FormattedMessage
          id="stripes-core.label.editEntry"
          values={{ entry: entryLabel }}
        >
          {contentLabelChunks => (
            <Layer
              isOpen={Boolean(query.layer)}
              contentLabel={contentLabelChunks.join()}
              container={container}
            >
              <EditForm
                servicePointsByName={servicePointsByName}
                initialValues={initialValues}
                onSave={updateSelected}
                onCancel={onCancel}
                checkLocationHasHoldingsOrItems={checkLocationHasHoldingsOrItems}
                institutions={institutions}
                campuses={campuses}
                libraries={libraries}
                servicePoints={servicePoints}
              />
            </Layer>
          )}
        </FormattedMessage>
      </RemoteStorageApiProvider>
      <Callout ref={callout} />
    </Paneset>
  );
};

LocationManager.propTypes = {
  label: PropTypes.node.isRequired,
};

export default LocationManager;
