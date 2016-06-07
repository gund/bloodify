/**
 * Created by alex on 6/3/16.
 */

import mongoose from "mongoose";
import { generateHash } from '../utils';

// Validators for schema
export const BLOOD_TYPES = 'A B AB O'.split(' ');
export const RH_TYPES = '+ -'.split(' ');
export const PHONE_REGEX = /^(\+|00)[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}\s?[0-9]{3}$/; // (+|00)xx xxx xxxx xxx
export const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
export const NAME_MAX_LENGTH = 50;
export const ADDRESS_MAX_LENGTH = 100;
export const COORD_MAX_LENGTH = 10; // 3 digits + 1 point char + 6 digit precision
// export const IP_MAX_LENGTH = 39; // Enough for IPv6 (ex. 2001:0db8:85a3:0000:0000:8a2e:0370:7334)

let donorSchema = new mongoose.Schema({
  // General Info
  firstName: {type: String, required: true, maxlength: NAME_MAX_LENGTH},
  lastName: {type: String, required: true, maxlength: NAME_MAX_LENGTH},
  number: {type: String, match: PHONE_REGEX, required: true},
  email: {type: String, match: EMAIL_REGEX, required: true, lowercase: true},
  hash: {type: String, default: generateHash},

  // Blood Info
  blood: {
    type: {type: String, enum: BLOOD_TYPES, required: true},
    rh: {type: String, enum: RH_TYPES, required: true}
  },

  // Coordinates
  address: {type: String, required: true, maxlength: ADDRESS_MAX_LENGTH},
  coord: [Number],
  ip: {type: String, required: true}
});

// Create Indexes
donorSchema.index({hash: 1, 'blood.type': 1, 'blood.rh': 1, address: 1, coord: '2d'});

// Expose methods
donorSchema.methods.generateHash = generateHash;

export default mongoose.model('Donor', donorSchema);
