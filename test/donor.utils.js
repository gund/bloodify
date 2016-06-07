/**
 * Created by alex on 6/4/16.
 */

import chai from 'chai';
let should = chai.should();

import Donor from '../app/models/donor.model';

export const createDonor = () => {
  return {
    firstName: 'Foo',
    lastName: 'Bar',
    number: '+112223333444',
    email: 'test@test.com',
    blood: {type: 'O', rh: '-'},
    address: 'Foo St.',
    coord: [12.345678, 12.3456789],
    ip: '0.0.0.0'
  };
};

export const compareDonors = (donor1, donor2) => {
  donor1.firstName.should.equal(donor2.firstName);
  donor1.lastName.should.equal(donor2.lastName);
  donor1.number.should.equal(donor2.number);
  donor1.email.should.equal(donor2.email);
  donor1.blood.type.should.equal(donor2.blood.type);
  donor1.blood.rh.should.equal(donor2.blood.rh);
  donor1.address.should.equal(donor2.address);
  donor1.coord[0].should.equal(donor2.coord[0]);
  donor1.coord[1].should.equal(donor2.coord[1]);
  // donor1.ip.should.equal(donor2.ip); This will be overridden during saving
};

export const invalidateDonorProp = (donorToken, prop, invalidVal, testProp) => {
  it(`should validate ${prop}`, (done) => {
    //noinspection JSUnresolvedVariable
    let donor = donorToken.donor;

    donor[prop] = invalidVal;
    Donor.create(donor, (err, donor_) => {
      should.exist(err);
      should.not.exist(donor_);
      err.should.have.deep.property(`errors.${testProp || prop}`);

      done();
    });
  });
};
