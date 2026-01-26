import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import { TitleManager, useStripes } from '@folio/stripes/core';

import Addresses from './Addresses';
import { Locale } from './Locale';
import Plugins from './Plugins';
import ReadingRoomAccess from './ReadingRoomAccess';
import SSOSettings from './SSOSettings';
import LocationCampuses from './LocationCampuses';
import LocationInstitutions from './LocationInstitutions';
import LocationLibraries from './LocationLibraries';
import LocationLocations from './LocationLocations';
import ServicePoints from './ServicePoints';


const Organization = (props) => {
  const intl = useIntl();
  const stripes = useStripes();

  const sections = [
    {
      label: (
        <TitleManager page={intl.formatMessage({ id: 'ui-tenant-settings.settings.title' })}>
          <FormattedMessage id="ui-tenant-settings.settings.general.label" />
        </TitleManager>
      ),
      pages: [
        {
          route: 'addresses',
          label: <FormattedMessage id="ui-tenant-settings.settings.addresses.label" />,
          component: Addresses,
          perm: 'ui-tenant-settings.settings.addresses.view',
        },
        {
          route: 'locale',
          label: <FormattedMessage id="ui-tenant-settings.settings.language.label" />,
          component: Locale,
          perm: 'ui-tenant-settings.settings.locale.view',
        },
        {
          route: 'plugins',
          label: <FormattedMessage id="ui-tenant-settings.settings.plugins.label" />,
          component: Plugins,
          perm: 'ui-tenant-settings.settings.plugins.view',
        },
        {
          route: 'reading-room',
          label: <FormattedMessage id="ui-tenant-settings.settings.reading-room-access.label" />,
          component: ReadingRoomAccess,
          perm: 'ui-tenant-settings.settings.reading-room-access.view',
          iface: 'reading-room'
        },
        {
          route: 'ssosettings',
          label: <FormattedMessage id="ui-tenant-settings.settings.ssoSettings.label" />,
          component: SSOSettings,
          perm: 'ui-tenant-settings.settings.sso.view',
          iface: 'login-saml'
        },
        {
          route: 'servicePoints',
          label: <FormattedMessage id="ui-tenant-settings.settings.servicePoints.label" />,
          component: ServicePoints,
          perm: 'ui-tenant-settings.settings.servicepoints.view',
          iface: 'service-points',
        },
      ],
    },
    {
      label: <FormattedMessage id="ui-tenant-settings.settings.location.label" />,
      pages: [
        {
          route: 'location-institutions',
          label: <FormattedMessage id="ui-tenant-settings.settings.location.institutions" />,
          component: LocationInstitutions,
          perm: 'ui-tenant-settings.settings.location.view',
          iface: 'location-units',
        },
        {
          route: 'location-campuses',
          label: <FormattedMessage id="ui-tenant-settings.settings.location.campuses" />,
          component: LocationCampuses,
          perm: 'ui-tenant-settings.settings.location.view',
          iface: 'location-units',
        },
        {
          route: 'location-libraries',
          label: <FormattedMessage id="ui-tenant-settings.settings.location.libraries" />,
          component: LocationLibraries,
          perm: 'ui-tenant-settings.settings.location.view',
          iface: 'location-units',
        },
        {
          route: 'location-locations',
          label: <FormattedMessage id="ui-tenant-settings.settings.location.locations" />,
          component: LocationLocations,
          perm: 'ui-tenant-settings.settings.location.view',
          iface: 'location-units',
        },
      ],
    }
  ];

  const filteredSections = sections.map(section => ({
    label: section.label,
    pages: section.pages.filter(page => !page.iface || stripes.hasInterface(page.iface)),
  }));

  return (
    <Settings
      {...props}
      stripes={stripes}
      sections={filteredSections}
      paneTitle={<FormattedMessage id="ui-tenant-settings.settings.index.paneTitle" />}
    />
  );
};

export default Organization;
