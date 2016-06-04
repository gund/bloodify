/**
 * Created by alex on 6/4/16.
 */

process.env.NODE_ENV = process.env.ENV = 'test';

let utils = require('./utils');
import request from 'supertest';
import chai from 'chai';
let should = chai.should();

import { app } from '../server.conf';
import Donor from '../app/models/donor.model';
import { createDonor, compareDonors } from "./donor.utils";

describe('Donor: router', () => {

  describe('GET /api/donor', () => {

    it('should return empty array', (done) => {
      request(app)
        .get('/api/donor')
        .expect(200, {data: []}, done);
    });

    it('should return all donors', (done) => {
      // Add donor
      Donor.create(createDonor(), (err, donor) => {
        should.not.exist(err);

        // Get donor
        request(app)
          .get('/api/donor')
          .expect(200)
          .end((err, res) => {
            if (err) done(err);

            // Response should be wrapped
            should.exist(res.body.data);
            res.body.data.should.be.an('array').and.have.lengthOf(1);

            compareDonors(donor, res.body.data[0]);

            done();
          });
      });
    });

  });

});
