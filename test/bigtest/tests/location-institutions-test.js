import { expect } from 'chai';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import institutions from '../interactors/location-institutions';

describe('LocationInstitutions', () => {
  setupApplication();

  describe('when button "New" is clicked', () => {
    beforeEach(async function () {
      this.visit('/settings/tenant-settings/location-institutions');

      await institutions.newButton.click();
    });

    it('new editable row is present', () => {
      expect(institutions.editRow.isPresent).to.be.true;
    });

    it('cancel button is present', () => {
      expect(institutions.cancelButton).to.exist;
    });

    describe('when button "Cancel" is clicked', () => {
      beforeEach(async function () {
        await institutions.cancelButton.click();
      });

      it('new editable row is not present', () => {
        expect(institutions.editRow.isPresent).to.be.false;
      });
    });
  });
});
