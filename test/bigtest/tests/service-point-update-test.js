import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import ServicePointUpdatePage from '../interactors/service-point-update';

describe('ServicePointUpdate', () => {
  setupApplication();
  let servicePoint;

  beforeEach(function () {
    servicePoint = this.server.create('servicePoint');
    this.visit(`/settings/tenant-settings/servicePoints/${servicePoint.id}?layer=edit`, () => {
      expect(ServicePointUpdatePage.$root).to.exist;
    });
  });

  describe('visiting the service point update page', () => {
    it('shows transit slip unchecked', () => {
      expect(ServicePointUpdatePage.isTransitSlipChecked).to.be.false;
    });
  });
});
