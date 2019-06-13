import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor'; // eslint-disable-line

@interactor class InstitutionsInteractor {
  editRow = scoped('[class*="editListRow"]');
  newButton = new ButtonInteractor('#clickable-add-institutions');
  cancelButton = new ButtonInteractor('#clickable-cancel-institutions-0');
}

export default new InstitutionsInteractor();
