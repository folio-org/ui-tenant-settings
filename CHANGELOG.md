# Change history for ui-tenant-settings

## 11.0.0 (IN PROGRESS)

* [UITEN-327](https://folio-org.atlassian.net/browse/UITEN-327) Invalidate queries after updating location
* [UITEN-330](https://folio-org.atlassian.net/browse/UITEN-330) *BREAKING* Refactor locale settings handling.
* [UITEN-326](https://folio-org.atlassian.net/browse/UITEN-326) Settings > Tenant > Add Tenant application icon.
* [UITEN-328](https://folio-org.atlassian.net/browse/UITEN-328) Settings > Tenant > Service points: view and edit the new `defaultCheckInActionForUseAtLocation` field. Requires v3.5 of the `service-points` interface.

## [10.0.0](https://github.com/folio-org/ui-tenant-settings/tree/v10.0.0)(2025-03-12)

* [UITEN-316](https://folio-org.atlassian.net/browse/UITEN-316) Fix code to pass ESLint successfully.
* [UITEN-314](https://folio-org.atlassian.net/browse/UITEN-314) Settings > Tenant > Locations setup > Locations. Enable and Display floating collection.
* [UITEN-317](https://folio-org.atlassian.net/browse/UITEN-317) Settings > Tenant > Locations setup > Locations. Display in detailed view when floating collection is enabled or not enabled.
* [UITEN-318](https://folio-org.atlassian.net/browse/UITEN-318) Settings > Tenant > Locations setup > Locations. Permissions govern viewing and editing floating collection.
* [UITEN-320](https://folio-org.atlassian.net/browse/UITEN-320) *BREAKING* migrate stripes-* dependencies.
* [UITEN-321](https://folio-org.atlassian.net/browse/UITEN-321) *BREAKING* migrate react-intl to v7.

## [9.0.0](https://github.com/folio-org/ui-tenant-settings/tree/v9.0.0)(2024-10-30)

* [UITEN-274](https://folio-org.atlassian.net/browse/UITEN-274) Use Save & close button label stripes-component translation key.
* [UITEN-280](https://folio-org.atlassian.net/browse/UITEN-280) Conditionally include SSO Settings based on login-saml interface.
* [UITEN-286](https://folio-org.atlassian.net/browse/UITEN-286) Add new interface. Add new permission to view reading room access in tenant settings.
* [UITEN-287](https://folio-org.atlassian.net/browse/UITEN-287) Add new permission to create, edit and remove reading room access in tenant settings.
* [UITEN-277](https://issues.folio.org/browse/UITEN-277) Ensure Reading Room Access settings page is wrapped by `Title Manager`.
* [UITEN-276](https://issues.folio.org/browse/UITEN-276) Reading Room Access (settings): Basic Layout.
* [UITEN-278] (https://issues.folio.org/browse/UITEN-278) Reading Room Access (settings): Create new reading room.
* [UITEN-282] (https://issues.folio.org/browse/UITEN-282) Reading Room Access (settings): Update reading room.
* [UITEN-283] (https://issues.folio.org/browse/UITEN-283) Reading Room Access (settings): Delete reading room.
* [UITEN-290] (https://issues.folio.org/browse/UITEN-290) Make dependency on mod-reading-rooms optional.
* [UITEN-298] (https://issues.folio.org/browse/UITEN-298) Update translation ids for reading room.
* [UITEN-301] (https://issues.folio.org/browse/UITEN-301) Display Reading room access in alphabetical order on settings page.
* [UITEN-212](https://folio-org.atlassian.net/browse/UITEN-212) Permission changes for service point management.
* [UITEN-299](https://folio-org.atlassian.net/browse/UITEN-299) Rewrite class components to functional ones (ui-tenant-settings module).
* [UITEN-304](https://folio-org.atlassian.net/browse/UITEN-304) Provide case insensitive sorted data to edit record, field components.
* [UITEN-302](https://folio-org.atlassian.net/browse/UITEN-302) Address existing UI issues on Settings > Tenant > Locations
* [UITEN-305](https://folio-org.atlassian.net/browse/UITEN-305) Permission changes for service point management (ECS environment)
* [UITEN-319](https://folio-org.atlassian.net/browse/UITEN-319) Migrate to shared GA workflows

## [8.1.0](https://github.com/folio-org/ui-tenant-settings/tree/v8.1.0)(2024-03-19)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v8.0.0...v8.1.0)

* [UITEN-266](https://issues.folio.org/browse/UITEN-266) No longer displays non-working inventory-related pages when the inventory interfaces are not present.
* [UITEN-269](https://issues.folio.org/browse/UITEN-269) User without "Settings (tenant): Can maintain preferred plugins" permission can edit preferred plugins.
* [UITEN-273](https://issues.folio.org/browse/UITEN-273) Use Save & close button label stripes-component translation key

## [8.0.0](https://github.com/folio-org/ui-tenant-settings/tree/v8.0.0)(2023-10-13)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v7.4.0...v8.0.0)

* [UITEN-232](https://issues.folio.org/browse/UITEN-232) Remember value in Institutions dropdown on Campuses settings page (Settings > Tenant > Campuses) when navigating away from page and returning
* [UITEN-247](https://issues.folio.org/browse/UITEN-247) Improve "Number of locations" on Institutions page
* [UITEN-233](https://issues.folio.org/browse/UITEN-233) Remember value in Institutions and campuses dropdown (Settings > Tenant > Libraries) when navigating away from page and returning
* [UITEN-233](https://issues.folio.org/browse/UITEN-234) Remember value in Institutions, campuses and libraries dropdown (Settings > Tenant > Locations) when navigating away from page and returning
* [UITEN-248](https://issues.folio.org/browse/UITEN-248) Improve "Number of locations" on Campuses page
* [UITEN-249](https://issues.folio.org/browse/UITEN-249) Improve "Number of locations" on Libraries page
* [UITEN-251](https://issues.folio.org/browse/UITEN-251) Service Point Page - Add Confirm Pickup location change popup message
* [UITEN-254](https://issues.folio.org/browse/UITEN-254) *BREAKING* Update `react` to `v18`.
* [UITEN-255](https://issues.folio.org/browse/UITEN-255) Update Node.js to v18 in GitHub Actions.
* [UITEN-241](https://issues.folio.org/browse/UITEN-241) Need new permission(s) to view all Tenant settings in UI - Location setup
* [UITEN-256](https://issues.folio.org/browse/UITEN-256) Need new permission(s) to view all Tenant settings in UI - General tab
* [UITEN-257](https://issues.folio.org/browse/UITEN-257) Tenant settings: Ensure your settings HTML page title follow this format - <<App name>> settings - <<selected page name>> - FOLIO.
* [UITEN-262](https://issues.folio.org/browse/UITEN-262) *BREAKING* bump `react-intl` to `v6.4.4`.
* [UITEN-260](https://issues.folio.org/browse/UITEN-260) prefer @folio/stripes exports to private paths when importing components.
* [UITEN-261](https://issues.folio.org/browse/UITEN-261) Fix eslint errors in UI-TENANT-SETTINGS.
* [UITEN-264](https://issues.folio.org/browse/UITEN-264) Tenant settings: (Duplicate - "New location" Pane) - Ensure your settings HTML page title follow this format - <<App name>> settings - <<selected page name>> - FOLIO

## [7.4.0](https://github.com/folio-org/ui-tenant-settings/tree/v7.4.0)(2023-02-20)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v7.3.0...v7.4.0)

* [UITEN-226](https://issues.folio.org/browse/UITEN-226) View-only access to Settings > Tenant > Location setup > Campuses
* [UITEN-225](https://issues.folio.org/browse/UITEN-225) View-only access to Settings > Tenant > Location setup > Institutions
* [UITEN-227](https://issues.folio.org/browse/UITEN-227) View-only access to Settings > Tenant > Location setup > Libraries.
* [UITEN-226](https://issues.folio.org/browse/UITEN-228) View-only access to Settings > Tenant > Location setup > Locations
* [UITEN-20](https://issues.folio.org/browse/UITEN-20) Add Closed Library Date Management to Service Point for Hold Shelf Expiration
* [UITEN-237](https://issues.folio.org/browse/UITEN-237) Update "Closed library date management for hold shelf expiration date calculation" menu
* [UITEN-223](https://issues.folio.org/browse/UITEN-223) Provide local translations to ControlledVocab
* [UITEN-214](https://issues.folio.org/browse/UITEN-214) Replace babel-eslint with @babel/eslint-parser
* [UITEN-238](https://issues.folio.org/browse/UITEN-238 )Unable to save service point on FOLIO snapshot or snapshot-2
* [UITEN-239](https://issues.folio.org/browse/UITEN-239) bump stripes to 8.0.0 for Orchid/2023-R1.

## [7.3.0](https://github.com/folio-org/ui-tenant-settings/tree/v7.3.0)(2022-10-20)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v7.2.0...v7.3.0)

* [UITEN-236](https://issues.folio.org/browse/UITEN-236) Upgrade interface 'users' to support version 16.0.
* [UITEN-211](https://issues.folio.org/browse/UITEN-211) Unable to modify tenant language and localization settings with ui-tenant-settings.settings.locale assigned.
* [UITEN-217](https://issues.folio.org/browse/UITEN-217) View of services points doesn't update when clicking from one location to another.
* [UITEN-224](https://issues.folio.org/browse/UITEN-224) ui-tenant-settings.settings.enabled does not function as expected
* [UITEN-230](https://issues.folio.org/browse/UITEN-230) Convert "Change session locale" from button to plain text link

## [7.2.0](https://github.com/folio-org/ui-tenant-settings/tree/v7.2.0)(2021-07-01)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v7.1.1...v7.2.0)

* [UITEN-181](https://issues.folio.org/browse/UITEN-181) Set numbering system independent of locale
* [UITEN-200](https://issues.folio.org/browse/UITEN-200) Language and localization > locale dropdown should be sorted in current locale
* [UITEN-176](https://issues.folio.org/browse/UITEN-176) Refactor away from `react-intl-safe-html`
* [UITEN-172](https://issues.folio.org/browse/UITEN-172) @folio/eslint-config-stripes@"^3.2.1" causes peer-dep inconsistency
* [UITEN-209](https://issues.folio.org/browse/UITEN-209) Improve in ui-tenant-settings test coverage with jest/RTL to 80%

## [7.1.0](https://github.com/folio-org/ui-tenant-settings/tree/v7.1.0)(2021-02-25)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v7.0.1...v7.1.0)

* [UITEN-189](https://issues.folio.org/browse/UITEN-189) menu ui-tenant-settings.settings.numberingSystem needs defined translation
* [UITEN-190](https://issues.folio.org/browse/UITEN-190) Service Point Locations accordion doesn't refresh when moving from existing service point to creating new service point
* [UITEN-175](https://issues.folio.org/browse/UITEN-175) prefer @folio/stripes exports to private paths when importing components
* [UITEN-191](https://issues.folio.org/browse/UITEN-191) Permissions error when editing Settings --> Tenant --> Locations
* [UITEN-187](https://issues.folio.org/browse/UITEN-187) refactor psets away from backend ".all" permissions
* [UITEN-201](https://issues.folio.org/browse/UITEN-201) Locations not visible in Settings > Tenant > Locations if more than 1000 locations exist on one library
* [UITEN-145](https://issues.folio.org/browse/UITEN-145) Rewrite Bigtest tests for Locations page with jest/react-testing-library

## [7.0.1](https://github.com/folio-org/ui-tenant-settings/tree/v7.0.0)(2021-11-11)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v7.0.0...v7.0.1)

* [UITEN-188](https://issues.folio.org/browse/UITEN-188) Upgrade react-intl-safe-html
* [UITEN-194](https://issues.folio.org/browse/UITEN-194) Unable to save location after changing remote location to No
## [7.0.0](https://github.com/folio-org/ui-tenant-settings/tree/v7.0.0)(2021-09-31)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v6.1.2...v7.0.0)

* [UITEN-181](https://issues.folio.org/browse/UITEN-181) Set numbering system independently of locale
* [UITEN-178](https://issues.folio.org/browse/UITEN-178) Permission sets should avoid ".all" permissions
* [UITEN-183](https://issues.folio.org/browse/UITEN-183) Increment stripes to v7

## (6.1.2)(https://github.com/folio-org/ui-tenant-settings/tree/v6.1.2)(2021-08-09)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v6.1.1...v6.1.2)

* [UITEN-170](https://issues.folio.org/browse/UITEN-170) Include missing staff-slips permission in service-points pset

## (6.1.1)(https://github.com/folio-org/ui-tenant-settings/tree/v6.1.1)(2021-07-20)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v6.1.0...v6.1.1)

* [UITEN-180](https://issues.folio.org/browse/UITEN-180) The Remote storage section is not displayed in the General Information pane

## [6.1.0](https://github.com/folio-org/ui-tenant-settings/tree/v6.1.0)(2021-06-11)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v6.0.0...v6.1.0)

* [UITEN-169](https://issues.folio.org/browse/UITEN-169) Move Tenant/Bursar exports to Users/Transfer criteria
* [UITEN-65](https://issues.folio.org/browse/UITEN-65) Disable key-bindings; it was just a mean tease.
* [UITEN-165](https://issues.folio.org/browse/UITEN-165) Add remote storage returning workflow details to location view.
* [UITEN-174](https://issues.folio.org/browse/UITEN-174) Update "remote-storage-mappings" interface
* [UITEN-179](https://issues.folio.org/browse/UITEN-179) Replace babel-polyfill with regenerator-runtime, remove turnOffWarnings and karma.conf
* Update translations

## [6.0.0](https://github.com/folio-org/ui-tenant-settings/tree/v6.0.0)(2021-03-12)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v5.0.1...v6.0.0)
* [UITEN-13](https://issues.folio.org/browse/UITEN-13) Build RTL/Jest unit test code coverage.
* [UITEN-123](https://issues.folio.org/browse/UITEN-123) Disable "Download metadata" button when url is not provided.
* [UITEN-127](https://issues.folio.org/browse/UITEN-127) Add additional permission to location permission set.
* [UITEN-128](https://issues.folio.org/browse/UITEN-128) Do not warn about dangling references in optional modules.
* [UITEN-80](https://issues.folio.org/browse/UITEN-80) Fix bug causing some locations to be miscounted in libraries list.
* [UITEN-146](https://issues.folio.org/browse/UITEN-146) Update `stripes` to `v6.0.0`.
* [UITEN-115](https://issues.folio.org/browse/UITEN-115) Make permission names localizable.
* [UITEN-119](https://issues.folio.org/browse/UITEN-119) Fix console warnings.
* [UITEN-119](https://issues.folio.org/browse/UITEN-119) Fix Jest catching /test/ui-testing/test.js
* [UITEN-119](https://issues.folio.org/browse/UITEN-119) Add remote-storage back-end module optional dependencies.
* [UITEN-119](https://issues.folio.org/browse/UITEN-119) Add remote-storage sub-perms in ui-tenant-settings.settings.location.
* [UITEN-119](https://issues.folio.org/browse/UITEN-119) Add Remote Storage field functionality to Location edit form.
* [UITEN-119](https://issues.folio.org/browse/UITEN-119) Refactor Location edit form.
* [UITEN-152](https://issues.folio.org/browse/UITEN-152) Bursar exports settings page
* [UITEN-158](https://issues.folio.org/browse/UITEN-158) Update `@folio/stripes-cli` to `v2`
* [UITEN-150](https://issues.folio.org/browse/UITEN-150) View remote storage details in settings > tenant > location
* [UITEN-151](https://issues.folio.org/browse/UITEN-151) Guard appearance of remote-storage field with `hasInterface()`
* [UITEN-162](https://issues.folio.org/browse/UITEN-162) Remote Storage configuration should be removed
* Update translations

## [5.0.1](https://github.com/folio-org/ui-tenant-settings/tree/v5.0.1) (2020-11-13)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v5.0.0...v5.0.1)
* [UITEN-132](https://issues.folio.org/browse/UITEN-132) Do not show download metadata button without correct perms.
* Update translations

## [5.0.0](https://github.com/folio-org/ui-tenant-settings/tree/v5.0.0) (2020-10-14)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v4.0.0...v5.0.0)
* [PERF-62](https://issues.folio.org/browse/PERF-62) Use more efficient queries.
* Refactor to `miragejs` from `bigtest/mirage`.
* [UITEN-105](https://issues.folio.org/browse/UITEN-105) Settings > Tenant > Locale show locales in current and native locale
* Increment `@folio/stripes` to `v5`, `react-router` to `v5.2`.
* [UITEN-76](https://issues.folio.org/browse/UITEN-76) Refactor forms to use final-form
* [UITEN-107](https://issues.folio.org/browse/UITEN-107) Retrieve data for up to 1000 plugins
* [UITEN-108](https://issues.folio.org/browse/UITEN-108) Import support locales from stripes-core.
* [FOLIO-2727](https://issues.folio.org/browse/FOLIO-2727) Temporarily disable flakey integration tests.
* [UITEN-109](https://issues.folio.org/browse/UITEN-109) Use `label`/`aria-label` correctly for tenant-locale settings
* [UITEN-112](https://issues.folio.org/browse/UITEN-112) Increment `react-intl` to `^5.8.0`.
* [UITEN-117](https://issues.folio.org/browse/UITEN-117) Fix Locale page crashes due to react-intl changes affecting the use of `formatDisplayName()`.
* [UITEN-34](https://issues.folio.org/browse/UITEN-34) Enable translation of headings on Settings.
* [UITEN-114](https://issues.folio.org/browse/UITEN-114) Fix Idp Url validator
* [UITEN-70](https://issues.folio.org/browse/UITEN-70) Add extra permission to make `Download metadata` button work correctly.
* Update translations

## [4.0.0](https://github.com/folio-org/ui-tenant-settings/tree/v4.0.0) (2020-06-11)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v3.0.0...v4.0.0)
### Stories
* [UITEN-103](https://issues.folio.org/browse/UITEN-103) Bump login-saml interface version and fix permissions
* [UITEN-74](https://issues.folio.org/browse/UITEN-74) Refuse to delete a location if it's in use by a course-listing or a course-reserve
* [UITEN-88](https://issues.folio.org/browse/UITEN-88) Settings > Tenant > Location Setup > Edit/View Location
* [UITEN-87](https://issues.folio.org/browse/UITEN-87) Settings > Tenant > Location Setup > New Location
* [UITEN-86](https://issues.folio.org/browse/UITEN-86) Settings > Tenant > Service Point > Detail Record updates
* [UITEN-85](https://issues.folio.org/browse/UITEN-85) Settings > Tenant Pages > Move Save button to the Footer - Implement the pane footer component
* [STRIPES-672](https://issues.folio.org/browse/STRIPES-672.) Purge `intlShape` in prep for `react-intl` `v4` migration. Refs STRIPES-672.
* [STRIPES-672](https://issues.folio.org/browse/STRIPES-672) Upgrade to `stripes` `4.0`, `react-intl` `4.5`. Refs STRIPES-672.
* Update translations

### Bugs
* [UITEN-32](https://issues.folio.org/browse/UITEN-32) Remove hardcoded font sizes
* [UITEN-72](https://issues.folio.org/browse/UITEN-72) Security update eslint to >= 6.2.1 or eslint-util >= 1.4.1
* [UITEN-81](https://issues.folio.org/browse/UITEN-81) Provide default `isActive` value for the locations loaded via API
* [UITEN-94](https://issues.folio.org/browse/UITEN-94) Accessibility Error: Form elements must have labels
* [UITEN-97](https://issues.folio.org/browse/UITEN-94) Accessibility Error: IDs used in ARIA and labels must be unique

## [3.0.0](https://github.com/folio-org/ui-tenant-settings/tree/v3.0.0) (2020-03-12)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v2.13.1...v3.0.0)

* Tenant / Addresses: Last updated by - Username not displayed. Fixes UITEN-71.
* Refactor away from ModalFooter button props
* Update "stripes" to 'v3.0.0', "stripes-components" to '6.0.0', "stripes-core" to '4.0.0' and "react-intl" to '2.9.0'. Refs UITEN-83.

## [2.14.0](https://github.com/folio-org/ui-tenant-settings/tree/v2.14.0) (2019-12-05)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v2.13.1...v2.14.0)

* Update "location-units" version bumped to '2.0'. Refs UITEN-61.
* Provide a link to session-locale settings from tenant-locale-settings. Refs UITEN-53.
* Fix new addresses saving. Refs UIOR-459.

## [2.13.1](https://github.com/folio-org/ui-tenant-settings/tree/v2.13.1) (2019-09-26)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v2.13.0...v2.13.1)

* Don't mutate form data in callbacks, preventing service point checkboxes from flashing. Fixes UITEN-54.

## [2.13.0](https://github.com/folio-org/ui-tenant-settings/tree/v2.13.0) (2019-09-10)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v2.12.0...v2.13.0)

* Delete unnecessary asterisks in location and service points forms. Refs UICIRC-281.
* Make institution, campus and library codes required in location settings. Refs UITEN-5.
* Update integration tests for new MCL. Refs STCOM-363.
* Handle issue when incorrect library is selected after the change of campus in location settings. Refs UITEN-41.

## [2.12.0](https://github.com/folio-org/ui-tenant-settings/tree/v2.12.0) (2019-07-24)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v2.11.0...v2.12.0)

* Remove unnecessary permissions. Refs UITEN-7, UIORG-150.
* Add translation support for labels in service point settings. UITEN-30.
* Retrieve all locations and staff-slips when viewing service points. Fixes UITEN-43.
* Restore duplicate location feature in locations settings. Fixes UITEN-33.
* Add Additional, Sortable Columns to Location List in Settings. UITEN-18, UITEN-24.
* Other bug fixes. UITEN-46, UITEN-44.

## [2.11.0](https://github.com/folio-org/ui-tenant-settings/tree/v2.11.0) (2019-06-13)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v2.10.0...v2.11.0)

* Primary Currency Setting. Refs UIU-1040.
* Mark hold shelf expiration period as required. UITEN-10 (was UIORG-153)

## [2.10.0](https://github.com/folio-org/ui-tenant-settings/tree/v2.10.0) (2019-06-10)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v2.9.1...v2.10.0)

* Add an address list to Settings - Tenant - Addresses. UINV-6
* Bug fixes: UITEN-4, UITEN-8 (was UIORG-172), UITEN-9 (was UIORG-163), UIOR-296
* Bug fix: mark Hold shelf expiration period as required. Fixes UIORG-153.

## [2.9.1](https://github.com/folio-org/ui-tenant-settings/tree/v2.9.1) (2019-05-20)
[Full Changelog](https://github.com/folio-org/ui-tenant-settings/compare/v2.9.0...v2.9.1)

* Update translations.
* Update location tests.

## [2.9.0](https://github.com/folio-org/ui-organization/tree/v2.9.0) (2019-05-16)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.8.0...v2.9.0)

* Increase location fetch limit to 1000. Refs UIORG-137.
* In service-point form, align sort of print-defaults and staffslip names. UIORG-167.

## [2.8.1](https://github.com/folio-org/ui-organization/tree/v2.8.1) (2019-03-27)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.8.0...v2.8.1)

* Increase service point fetch limit to 500. Fixes UIIN-509
* Delete confirmation checks. Fixes tests

## [2.8.0](https://github.com/folio-org/ui-organization/tree/v2.8.0) (2019-03-15)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.7.0...v2.8.0)

* Add hold-shelf expiration period to service points. Fixes UIORG-143.
* Set print slip print defaults on service point. Fixes UIORG-144.
* Robust integration tests avoid selectors with translatable values. Refs STCOM-296.
* Hold-shelf expiration period must be >= 0. Fixes UIORG-145.
* Update l10n strings.

## [2.7.0](https://github.com/folio-org/ui-organization/tree/v2.7.0) (2019-01-25)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.6.0...v2.7.0)

* Upgrade to stripes v2.0.0.

## [2.6.0](https://github.com/folio-org/ui-organization/tree/v2.6.0) (2018-12-17)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.5.1...v2.6.0)

* Add ability to copy location record. Fixes UIORG-117.
* Enable filtering of location records by institution, campus and library. Fixes UIORG-92.
* Show correct Pickup Location flag. Fixes UIORG-118.
* Service point array is now a required attribute of locations. Refs UIORG-115.
* Provide sortby key to `ControlledVocab`. Refs STSMACOM-139.
* Don't check users version in tests. Fixes UIORG-121.
* Add Arabic as a Locale.
* Display locations associated with the service point. Fixes UIORG-127.
* Disallow deletion of SPs that are primary for location. Fixes UIORG-129.
* Hide service point delete button. Fixes UIORG-130.
* Pass strings not nodes to `<ControlledVocab>`. Fixes UIORG-134.

## [2.5.1](https://github.com/folio-org/ui-organization/tree/v2.5.1) (2018-10-05)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.5.0...v2.5.1)

* Fix `ViewMetaData` import

## [2.5.0](https://github.com/folio-org/ui-organization/tree/v2.5.0) (2018-10-04)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.3.0...v2.5.0)

* Provide default `isActive` value for new locations. Fixes UIORG-109.
* Add permission for service points. Fixes UIORG-106.
* Update `stripes-form` dependency to v1.0.0.
* Expose Portuguese as a localization option. Fixes UIORG-113.
* Use `stripes` framework 1.0

## [2.3.0](https://github.com/folio-org/ui-organization/tree/v2.3.0) (2017-09-06)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.2.0...v2.3.0)

* Added AutoSuggest component to the lib folder. Fixes UIORG-87
* Refactor usage of `dataKey`. Fixes UIORG-36.
* Setup CRUD for Shelving Locations v1. Fixes UIORG-2.
* Expanded SSO configuration page with new fields. Added interface dependency for `mod-login-saml`. Fixes UIORG-25.
* Delete `metadata` sub-record from configuration before resubmitting it to mod-configuration, which rejects the record if it's included. Avoids a 422 Unprocessable Entity error. Fixes UIORG-29.
* Upgrade stripes-connect dependency to v3.0.0-pre.1. Fixes UIORG-38 (at least, with the present git master).
* Add save buttons to organization settings. Fixes UIORG-41.
* Use more-current stripes-components. Refs STRIPES-495.
* Add single save button to preferred plugins page. Fixes UIORG-42.
* Refactor settings to use ConfigManager. Fixes UIORG-44.
* Add Okapi URL to SSO configuration page. Fixes UIORG-40.
* Add validation for Okapi and IdP URLs. Fixes UIORG-43.
* Ignore yarn-error.log file. STRIPES-517.
* Location-Institution, campus, library, location CRUD. Fixes UIORG-54, UIORG-61, UIORG-65, UIORG-69. Work on the latter includes additional location fields, better parens handling for institutions, refreshing lookup tables on mount, cleanup, and refactoring asyncValidation so failures persist through blurs.
* Disallow deletion of an institution when it is in use. Fixes UIORG-62.
* Disallow deletion of a campus when it is in use. Fixes UIORG-64.
* Disallow deletion of a library when it is in use. Fixes UIORG-67.
* Add Service Point CRUD. Fixes UIORG-50.
* Add Okapi interfaces to package.json. Fixes UIORG-73.
* Fix up panel display for Shelving Locations settings. Fixes UIORG-108.
* Remove fee fine owner from service points settings page. Fixes UIORG-74.
* Add `ui-organization.settings.location` permission for maintaining locations. Fixes UIORG-76.
* Require a user to have `ui-organization.settings.location` in order to maintain locations. Fixes UIORG-78.
* Include location-count on libraries page. Refs UIORG-66.
* Modify use of stripes-components to avoid referencing obsolete `/structures/` directory. Refs STCOM-277.
* Refresh location counts on mount. Refs UIORG-60, UIORG-63.
* Perform field-level validation of unique names, codes on save.
* Hide Campus and Library CRUD panels until Institution and Campus filters are valid. Refs UIORG-82, UIORG-83.
* Add location-managment tests.
* Assign locations to service points. Fixes UIORG-90.
* Pass manager resources with alternative props name.
* Make stripes-core a peer-dependency rather than a regular dependency, to avoid duplicates in the bundle.
* Provide an id prop to `<ConfirmationModal>` to avoid it autogenerating one for us. Refs STCOM-317.
* In the location manager in the settings, fetch up to 40 locations (was 10), and sort them by name. Fixes UIORG-101.
* Validate use of locations prior to deletion. Refs UIORG-86.
* Clicking Save and close on location lookup popup registers the location. Fixes UIORG-104.
* Reorganize settings pane into sections. Fixes UIORG-75.
* When code isn't specified in location setup, don't display "Undefined". Fixes UIORG-85.
* Relocate language files. Fixes UIORG-88.

## [2.2.0](https://github.com/folio-org/ui-organization/tree/v2.2.0) (2017-09-01)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.1.0...v2.2.0)

* Use translations for headings of some settings pages. Fixes UIORG-24.
* Switch manifest data to resources. Fixes UIORG-21.
* Add numerous settings-related permissions. Fixes UIORG-26.
* Add SSO configuration page with IdP URL setting. Fixes UIORG-16.
* Upgrade dependencies to stripes-components 1.7.0, stripes-connect 2.7.0 and stripes-core 2.7.0.

## [2.1.0](https://github.com/folio-org/ui-organization/tree/v2.1.0) (2017-07-11)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.0.0...v2.1.0)

* `<PluginType>` editor now offers special "(none)" value. Fixes UIORG-17.
* Ability to edit preferences for multiple plugins. Fixes UIORG-18.
* Bump `configuration` interface dependency to v2.0. Fixes UIORG-19.
* Bump Stripes dependencies: stripes-components from v0.15.0 to v1.2.0, stripes-core from v1.14.0 to v2.1.0 and stripes-connect from v2.3.0 to v2.4.0.

## [2.0.0](https://github.com/folio-org/ui-organization/tree/v2.0.0) (2017-07-03)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v1.1.0...v2.0.0)

* Add `okapiInterfaces` and `permissionSets` to `package.json`. Fixes UIORG-13.
* Upgrade to `configuration` interface v1.0. Fixes UIORG-15.
* Use %{foo} instead of ${foo} for CQL string interpolation. Part of STRPCONN-5.

## [1.1.0](https://github.com/folio-org/ui-organization/tree/v1.1.0) (2017-06-19)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v1.0.0...v1.1.0)

* Key-bindings editor validates JSON on the fly. Fixes UIORG-8.
* Locale-changes take effect instantly, not requiring a logout/login. Fixes UIORG-9. (Requires stripes-core v1.14.0, so dependency was updated accordingly.)
* Stripes-connect resource names in the bindings editor made unique within the module.

## [1.0.0](https://github.com/folio-org/ui-organization/tree/v1.0.0) (2017-06-16)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.5.0...v1.0.0)

* Add new settings section, hotkeys editor. Presently just a text-area, will become more sophisticated later. Fixes UIORG-7.
* The step up to v1.0 does not indicate a major change, but graduating into full semantic versioning.

## [0.5.0](https://github.com/folio-org/ui-organization/tree/v0.5.0) (2017-06-11)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.4.0...v0.5.0)

* Add two locales: de-DE (German - Germany) and hu-HU (Hungarian)
* Remove the "About" area, which has been superseded by Stripes Core's own About page.

## [0.4.0](https://github.com/folio-org/ui-organization/tree/v0.4.0) (2017-05-18)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.3.0...v0.4.0)

* Add new plugin-type settings. Fixes STRIPES-380.
* We no longer pass all props into the `<Pluggable>` component, only the ones it needs.
* The list of back-end modules in the About settings is now sorted by name.
* All settings components now use the `label` prop, passed in from the `<Settings>` in stripes-components v0.9.0.

## [0.3.0](https://github.com/folio-org/ui-organization/tree/v0.3.0) (2017-05-18)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.2.0...v0.3.0)

* Add a markdown-editor plugin surface to the About page. Proof of concept for STRIPES-379.

## [0.2.0](https://github.com/folio-org/ui-organization/tree/v0.2.0) (2017-05-16)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.1.0...v0.2.0)

* Add an "About" page within the Organization settings. At present this shows the list of modules running on the back-end, together with the module details as returned from Okapi. Fixes STRIPES-378.

## [0.1.0](https://github.com/folio-org/ui-organization/tree/v0.1.0) (2017-05-05)

* The first formal release.
