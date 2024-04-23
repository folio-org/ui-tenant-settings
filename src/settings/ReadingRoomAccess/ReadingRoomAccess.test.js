import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../../test/jest/__mocks__';
import buildStripes from '../../../test/jest/__new_mocks__/stripesCore.mock';

import {
  renderWithRouter,
  renderWithReduxForm,
} from '../../../test/jest/helpers';

import ReadingRoomAccess from './ReadingRoomAccess';

const STRIPES = buildStripes();

const mutatorMock = {
  values: {
    // PUT: jest.fn(() => Promise.resolve()),
    // DELETE: jest.fn(() => Promise.resolve()),
    GET: jest.fn(() => Promise.resolve()),
    POST: jest.fn(() => Promise.resolve()),
  },
};

const resourcesMock = {
  values: {
    dataKey: 'reading-room',
    failed: false,
    hasLoaded: true,
    httpStatus: 200,
    isPending: false,
    module: '@folio/tenant-settings',
    records: [
      {
        'id': '04efd73f-f7e3-4c19-8614-861941dd1d8e',
        'name': 'readingroom-422',
        'isPublic': true,
        'servicePoints': [
          {
            'value': '7c5abc9f-f3d7-4856-b8d7-6712462ca007',
            'label': 'Online'
          }
        ],
        'metadata': {
          'createdDate': '2024-04-22T11:41:52.904334',
          'createdByUserId': '2db30b15-7a36-4f02-9c77-999dbb470874'
        }
      },
      {
        'id': '75e44262-f68c-418c-ab4c-88c9198669c1',
        'name': 'reading-room-4221',
        'isPublic': true,
        'servicePoints': [
          {
            'value': '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
            'label': 'Circ Desk 1'
          }
        ],
        'metadata': {
          'createdDate': '2024-04-22T11:48:50.255863',
          'createdByUserId': '2db30b15-7a36-4f02-9c77-999dbb470874'
        }
      },
      {
        'id': '7c5abc9f-f3d7-4856-b8d7-6712462ca009',
        'name': 'reading-room-555',
        'isPublic': false,
        'servicePoints': [
          {
            'value': 'c4c90014-c8c9-4ade-8f24-b5e313319f4b',
            'label': 'Circ Desk 4'
          }
        ],
        'metadata': {
          'createdDate': '2024-04-19T11:56:15.192057',
          'createdByUserId': '2db30b15-7a36-4f02-9c77-999dbb470874',
          'updatedDate': '2024-04-22T04:38:00.75285',
          'updatedByUserId': '2db30b15-7a36-4f02-9c77-999dbb470874'
        }
      }
    ],
  },
  RRAServicePoints: {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [
      {
        'servicepoints': [
          {
            'id': 'c4c90014-c8c9-4ade-8f24-b5e313319f4b',
            'name': 'Circ Desk 2',
            'code': 'cd2',
            'discoveryDisplayName': 'Circulation Desk -- Back Entrance',
            'pickupLocation': true,
            'holdShelfExpiryPeriod': {
              'duration': 5,
              'intervalId': 'Days'
            },
            'holdShelfClosedLibraryDateManagement': 'Keep_the_current_due_date',
            'staffSlips': [],
            'metadata': {
              'createdDate': '2024-04-23T01:53:59.590+00:00',
              'updatedDate': '2024-04-23T01:53:59.590+00:00'
            }
          },
          {
            'id': '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
            'name': 'Circ Desk 1',
            'code': 'cd1',
            'discoveryDisplayName': 'Circulation Desk -- Hallway',
            'pickupLocation': true,
            'holdShelfExpiryPeriod': {
              'duration': 3,
              'intervalId': 'Weeks'
            },
            'holdShelfClosedLibraryDateManagement': 'Keep_the_current_due_date',
            'staffSlips': [],
            'metadata': {
              'createdDate': '2024-04-23T01:53:59.598+00:00',
              'updatedDate': '2024-04-23T01:53:59.598+00:00'
            }
          },
          {
            'id': '7c5abc9f-f3d7-4856-b8d7-6712462ca007',
            'name': 'Online',
            'code': 'Online',
            'discoveryDisplayName': 'Online',
            'shelvingLagTime': 0,
            'pickupLocation': false,
            'holdShelfClosedLibraryDateManagement': 'Keep_the_current_due_date',
            'staffSlips': [],
            'metadata': {
              'createdDate': '2024-04-23T01:53:59.593+00:00',
              'updatedDate': '2024-04-23T01:53:59.593+00:00'
            }
          },
          {
            'id': '9d1b77e8-f02e-4b7f-b296-3f2042ddac54',
            'name': 'DCB',
            'code': '000',
            'discoveryDisplayName': 'DCB',
            'pickupLocation': true,
            'holdShelfExpiryPeriod': {
              'duration': 3,
              'intervalId': 'Days'
            },
            'holdShelfClosedLibraryDateManagement': 'Keep_the_current_due_date',
            'staffSlips': [],
            'metadata': {
              'createdDate': '2024-04-23T01:56:03.899+00:00',
              'updatedDate': '2024-04-23T01:56:03.899+00:00'
            }
          }
        ],
        'totalRecords': 4
      }
    ],
  }
};

const renderReadingRoomAccess = (props) => {
  const component = () => (
    <ReadingRoomAccess {...props} />
  );

  return renderWithRouter(renderWithReduxForm(component));
};

describe('Reading Room Access', () => {
  const props = {
    mutator: mutatorMock,
    resources: resourcesMock,
    stripes:{ STRIPES }
  };

  beforeEach(() => {
    renderReadingRoomAccess(props);
  });

  it('should render a Pane with title "Reading room access"', () => {
    expect(screen.getByLabelText('ui-tenant-settings.settings.reading-room-access.label')).toBeInTheDocument();
  });

  it('should render new button', () => {
    expect(screen.getByRole('button', { name: 'stripes-core.button.new' })).toBeVisible();
  });

  it('should render correct result column', () => {
    const columnHeaders = [
      /settings.reading-room-access.name/,
      /settings.reading-room-access.public/,
      /settings.reading-room-access.asp/
    ];

    columnHeaders.forEach((el) => expect(screen.getByRole('columnheader', { name: el })).toBeVisible());
  });

  it('create reading room', async () => {
    const newButton = screen.getByRole('button', { name: 'stripes-core.button.new' });
    await userEvent.click(newButton);
    await waitFor(() => {
      expect(screen.getByText('stripes-core.button.save')).toBeInTheDocument();
      expect(document.querySelector('[name="items[0].name"]')).toBeInTheDocument();
    });

    await userEvent.type(document.querySelector('[name="items[0].name"]'), 'test');
    await userEvent.click(document.querySelectorAll("[class^='multiSelectToggleButton']")[0]);
    await userEvent.click(document.querySelectorAll('[class^="multiSelectOption"]')[0]);
    await userEvent.click(screen.getByText('stripes-core.button.save'));

    await waitFor(() => {
      expect(screen.queryByText('stripes-core.button.save')).not.toBeInTheDocument();
    });
  });
});
