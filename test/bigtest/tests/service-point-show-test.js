import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import ServicePointShowPage from '../interactors/service-point-show';

describe('ServicePointShow', () => {
  setupApplication();
  let servicePoint;

  describe('displaying staff slip', () => {
    beforeEach(async function () {
      servicePoint = await this.server.create('servicePoint');
      return this.visit(`/settings/tenant-settings/servicePoints/${servicePoint.id}`);
    });

    it('displays staff slips', () => {
      expect(ServicePointShowPage.holdSlipList(0).text).to.equal('Hold - yes');
      expect(ServicePointShowPage.holdSlipList(1).text).to.equal('Transit - no');
    });
  });

  describe('showing hold shelf expiry period', () => {
    beforeEach(async function () {
      servicePoint = await this.server.create('servicePoint', {
        pickupLocation: true,
        holdShelfExpiryPeriod: {
          duration: 2,
          intervalId: 'Days',
        },
      });
      return this.visit(`/settings/tenant-settings/servicePoints/${servicePoint.id}`);
    });

    it('shows hold shelf expiry period', () => {
      expect(ServicePointShowPage.holdShelfPeriodPresent).to.be.true;
    });
  });
});
