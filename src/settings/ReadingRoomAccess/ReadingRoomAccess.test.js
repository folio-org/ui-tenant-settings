import { screen } from '@testing-library/react';

import '../../../test/jest/__mocks__';
import buildStripes from '../../../test/jest/__new_mocks__/stripesCore.mock';

import {
  renderWithRouter, renderWithReduxForm
} from '../../../test/jest/helpers';

import ReadingRoomAccess from './ReadingRoomAccess';

const STRIPES = buildStripes();

const renderReadingRoomAccess = (props) => {
  const component = () => (
    <ReadingRoomAccess {...props} />
  );

  return renderWithRouter(renderWithReduxForm(component));
};

describe('Reading Room Access', () => {
  describe('when no records exist', () => {
    const props = {
      resources : [],
      stripes:{ STRIPES }
    };
    beforeEach(() => {
      renderReadingRoomAccess(props);
    });

    it('should render a Pane with title "Reading room access"', () => {
      expect(screen.getByLabelText('ui-tenant-settings.settings.reading-room-access.label')).toBeInTheDocument();
    });

    // it('should render text "There are no Reading room access"', () => {
    //   expect(screen.getByText('stripes-smart-components.cv.noExistingTerms')).toBeInTheDocument();
    // });
  });
});
