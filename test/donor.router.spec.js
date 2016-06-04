/**
 * Created by alex on 6/4/16.
 */

process.env.NODE_ENV = process.env.ENV = 'test';

import request from 'supertest';
import chai from 'chai';
let should = chai.should();
let utils = require('./utils');

import { app } from '../server.conf';
import Donor from '../app/models/donor.model';
import { createDonor, compareDonors } from "./donor.utils";

const api = url => app.API_PATH + url;

describe('Donor: router', () => {

  describe('/donor', () => {

    describe('GET', () => {
      it('should return empty array', (done) => {
        request(app)
          .get(api('/donor'))
          .expect(200, {data: []}, done);
      });

      it('should return all donors', (done) => {
        let donor1 = createDonor(), donor2 = createDonor();
        donor2.firstName = 'Different Name';

        Promise.all([
          Donor.create(donor1),
          Donor.create(donor2)
        ]).then((donors) => {
          // Get donors
          request(app)
            .get(api('/donor'))
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);
              should.exist(res.body.data); // Response should be wrapped
              res.body.data.should.be.an('array').and.have.lengthOf(2);

              // We should not see hash
              should.not.exist(res.body.data[0].hash);
              should.not.exist(res.body.data[1].hash);

              compareDonors(donors[0], res.body.data[0]);
              compareDonors(donors[1], res.body.data[1]);

              done();
            });
        }).catch(done);
      });
    });

    describe('POST', () => {
      it('should return error on invalid donor', (done) => {
        let donor = createDonor();
        donor.email = 'invalid email';

        request(app)
          .post(api('/donor'))
          .send({donor: donor}) // We expect to wrap donor in object
          .expect(500, done);
      });

      it('should create and return new donor', (done) => {
        let donor = createDonor();

        request(app)
          .post(api('/donor'))
          .send({donor: donor}) // We expect to wrap donor in object
          .expect(200)
          .end((err, res) => {
            should.not.exist(err);
            should.exist(res.body.data);
            compareDonors(donor, res.body.data);

            // We should get hash
            should.exist(res.body.data.hash);
            res.body.data.hash.should.be.a('string').and.not.be.empty;

            done();
          });
      });
    });

  });

  describe('/donor/:donor_id', () => {
    let donor;

    beforeEach(() => {
      // Create donor
      return Donor.create(createDonor(), (err, donor_) => donor = donor_);
    });

    describe('GET', () => {
      it('should return 404 when not found', (done) => {
        request(app)
          .get(api('/donor/123'))
          .expect(404, done);
      });

      it('should get donor by id', (done) => {
        let donor1 = createDonor(), donor2 = createDonor();
        donor2.address = 'My address';

        Promise.all([
          Donor.create(donor1),
          Donor.create(donor2)
        ]).then((donors) => {
          // Get donor by id
          request(app)
            .get(api(`/donor/${donors[1]._id}`))
            .expect(200)
            .end((err, res) => {
              should.not.exist(err);
              should.exist(res.body.data);
              compareDonors(donors[1], res.body.data);
              // No hash in response
              should.not.exist(res.body.data.hash);

              done();
            });
        }, done);
      });
    });

    describe('PUT', () => {
      it('should return 404 when donor does not exist', (done) => {
        request(app)
          .put(api('/donor/qwe'))
          .send({donor: createDonor()})
          .expect(404, done);
      });

      it('should validate new donor data and return 500 on error', (done) => {
        donor.email = 'not valid';
        request(app)
          .put(api(`/donor/${donor.hash}`))
          .send({donor: donor})
          .expect(500, done);
      });

      it('should not update hash and return updated donor', (done) => {
        request(app)
          .put(api(`/donor/${donor.hash}`))
          .send({donor: {hash: 'want to change it', email: 'me@me.com'}})
          .expect(200)
          .end((err, res) => {
            should.not.exist(err);
            should.exist(res.body.data);
            res.body.data.hash.should.equal(donor.hash);
            res.body.data.email.should.equal('me@me.com');

            done();
          });
      });

      it('should update donor', (done) => {
        donor.firstName = 'Updated name';
        request(app)
          .put(api(`/donor/${donor.hash}`))
          .send({donor: donor})
          .expect(200)
          .end((err, res) => {
            should.not.exist(err);
            should.exist(res.body.data);
            compareDonors(donor, res.body.data);
            should.exist(res.body.data.hash);

            done();
          });
      });
    });

    describe('DELETE', () => {
      it('should return 404 error when not donor found', (done) => {
        request(app)
          .delete(api(`/donor/123`))
          .expect(404, done);
      });

      it('should delete donor and return it\'s data', (done) => {
        request(app)
          .delete(api(`/donor/${donor.hash}`))
          .expect(200)
          .end((err, res) => {
            should.not.exist(err);
            should.exist(res.body.data);
            res.body.data.hash.should.equal(donor.hash);

            // Ensure we do not have any more donors
            Donor.find()
              .then(donors => donors.should.have.lengthOf(0), done)
              .then(() => done());
          });
      });
    });

  });

  describe('/api/donor/link/:hash', () => {
    let donor;

    beforeEach(() => {
      // Create donor
      return Donor.create(createDonor(), (err, donor_) => donor = donor_);
    });

    describe('GET', () => {
      it('should return 404 if no donor found', (done) => {
        request(app)
          .get(api('/donor/link/123'))
          .expect(404, done);
      });

      it('should return donor with hash', (done) => {
        request(app)
          .get(api(`/donor/link/${donor.hash}`))
          .expect(200)
          .end((err, res) => {
            should.not.exist(err);
            should.exist(res.body.data);
            res.body.data.hash.should.equal(donor.hash);
            compareDonors(res.body.data, donor);

            done();
          })
      });
    });

  });

});
