/**
 * Created by alex on 6/4/16.
 */

// import the `mongoose` helper utilities
let utils = require('./utils');
import chai from 'chai';
let should = chai.should();

import Donor from '../app/models/donor.model';
import {invalidateDonorProp, compareDonors, createDonor} from './donor.utils';

describe('Donor: models', () => {

  describe('create()', () => {
    let donor, donorToken = {donor: null};

    beforeEach(() => {
      donor = donorToken.donor = createDonor();
    });

    it('should create a new Donor', (done) => {
      Donor.create(donor, (err, donor_) => {
        should.not.exist(err);

        // Check that hash was generated
        donor_.hash.should.be.a('string').and.not.to.be.empty;

        compareDonors(donor_, donor);

        done();
      });
    });

    invalidateDonorProp(donorToken, 'email', 'not valid email @here.com');
    invalidateDonorProp(donorToken, 'number', '0438544323');
    invalidateDonorProp(donorToken, 'blood', {type: 'Z', rh: '+'}, 'blood\\.type');
    invalidateDonorProp(donorToken, 'blood', {type: 'A', rh: '*'}, 'blood\\.rh');
    // invalidateDonorProp(donorToken, 'coord', [12.34567890, 12.3456789]);

  });

});

