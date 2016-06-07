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
      let donor = req.body['donor'];
      donor.ip = req.ip;
      Donor.create(donor, (err, donor_) => {
        if (err) return next(err);
        res.json(donor_);
      });
    });

  router.route('/donor/:donor_id')

  // Get donor by id @ GET API_PATH/donor:donor_id
    .get((req, res) => Donor.findById(req.params['donor_id'], {hash: 0}, (err, donor) => res.json(donor)))

    // Update donor by id (Hash) @ PUT /api/donor:donor_id
    .put((req, res, next) => {
      let donor = req.body['donor'];
      donor.ip = req.ip;
      // Prevent hash to be updated
      if ('hash' in donor) delete donor['hash'];
      Donor.findOneAndUpdate({hash: req.params['donor_id']}, donor, {
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

  router.route('/donor/lng1/:lng1/lat1/:lat1/lng2/:lng2/lat2/:lat2/lng3/:lng3/lat3/:lat3/lng4/:lng4/lat4/:lat4')

    .get((req, res, next) => {
      let lng1 = parseFloat(req.params['lng1']),
        lat1 = parseFloat(req.params['lat1']),
        lng2 = parseFloat(req.params['lng2']),
        lat2 = parseFloat(req.params['lat2']),
        lng3 = parseFloat(req.params['lng3']),
        lat3 = parseFloat(req.params['lat3']),
        lng4 = parseFloat(req.params['lng4']),
        lat4 = parseFloat(req.params['lat4']);

      Donor.find({
        coord: {
          $geoWithin: {
            $geometry: {
              type: "Polygon",
			  coordinates: [[
				[lat1, lat1],
				[lat2, lat2],
				[lat3, lat3],
				[lat4, lat4],
				[lat1, lat1]
              ]]
            }
          }
        }
      }, (err, donors) => {
        if (err) return next(err);
        res.json(donors);
      });
    });

};
