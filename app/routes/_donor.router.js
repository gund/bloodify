/**
 * Created by alex on 6/3/16.
 */

// ## Donor API Object

// HTTP Verb  Route                   Description

// GET        /api/donor              Get all of the donor items
// GET        /api/donor/:donor_id    Get a single donor item by donor item id
// GET        /api/donor/link/:hash   Get donor by hash to edit/delete record
// POST       /api/donor              Create a single donor item
// DELETE     /api/donor/:donor_id    Delete a single donor item
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

  // Get all donors @ GET /api/donor
    .get((req, res) => {
      Donor.find((err, donors) => {
        if (err) throw err;
        res.json(donors);
      });
    })

    // Create new donor @ POST /api/donor
    .post((req, res) => {
      //noinspection JSUnresolvedVariable
      Donor.create(req.body.donor, (err, donor) => {
        if (err) throw err;
        res.json(donor);
      });
    });

  router.route('/donor/:donor_id')

  // Get donor by id @ GET /api/donor:donor_id
    .get((req, res) => {
      //noinspection JSUnresolvedVariable
      Donor.findOne(req.param.donor_id, (err, donor) => {
        if (err) throw err;
        res.json(donor);
      });
    })

    // Update donor by id (Hash) @ PUT /api/donor:donor_id
    .put((req, res) => {
      //noinspection JSUnresolvedVariable
      Donor.findOne({hash: req.param.donor_id}, req.body.donor, {new: true}, (err, donor) => {
        if (err) throw err;
        res.json(donor);
      });
    })

    // Delete donor by id @ DELETE /api/donor:donor_id
    .delete((req, res) => {
      //noinspection JSUnresolvedVariable
      Donor.findByIdAndRemove(req.param.donor_id, (err) => {
        if (err) throw err;
        res.json('OK');
      });
    });

  router.route('/donor/link/:hash')

  // Get donor by hash @ GET /api/donor/link/:hash
    .get((req, res) => {
      Donor.findOne({hash: req.param.hash}, (err, donor) => {
        if (err) throw err;
        res.json(donor);
      });
    });

};
