/**
 * Created by alex on 6/3/16.
 */

// ## Donor API Object

// HTTP Verb  Route                   Description

// GET        /api/donor              Get all of the donor items
// GET        /api/donor/:donor_id    Get a single donor item by donor item id
// GET        /api/donor/link/:hash   Get donor by hash to edit/delete record
// POST       /api/donor              Create a single donor item
// DELETE     /api/donor/:donor_id    Delete a single donor item (Hash)
// PUT        /api/donor/:donor_id    Update a donor item by id (Hash)

import Donor from "../models/donor.model";
import { mungJson, mungCustomError } from "../utils";

export default (app, router) => {

  // Use mung middleware
  app.use(mungJson);

  // Enable custom exception handler for mung
  mungCustomError();

  // ### Donor API Routes

  router.route('/donor')

  // Get all donors @ GET API_PATH/donor
    .get((req, res) => Donor.find({}, {hash: 0}, (err, donors) => res.json(donors)))

    // Create new donor @ POST API_PATH/donor
    .post((req, res, next) => {
      Donor.create(req.body['donor'], (err, donor) => {
        if (err) return next(err);
        res.json(donor);
      });
    });

  router.route('/donor/:donor_id')

  // Get donor by id @ GET API_PATH/donor:donor_id
    .get((req, res) => Donor.findById(req.params['donor_id'], {hash: 0}, (err, donor) => res.json(donor)))

    // Update donor by id (Hash) @ PUT /api/donor:donor_id
    .put((req, res, next) => {
      // Prevent hash to be updated
      if ('hash' in req.body['donor']) delete req.body['donor']['hash'];
      Donor.findOneAndUpdate({hash: req.params['donor_id']}, req.body['donor'], {
        new: true,
        runValidators: true
      }, (err, donor) => {
        if (err) return next(err);
        res.json(donor);
      });
    })

    // Delete donor by id (Hash) @ DELETE API_PATH/donor:donor_id
    .delete((req, res, next) => {
      Donor.findOneAndRemove({hash: req.params['donor_id']}, (err, donor) => {
        if (err) return next(err);
        res.json(donor);
      });
    });

  router.route('/donor/link/:hash')

  // Get donor by hash @ GET API_PATH/donor/link/:hash
    .get((req, res) => Donor.findOne({hash: req.params['hash']}, (err, donor) => res.json(donor)));

};
