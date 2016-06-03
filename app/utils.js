/**
 * Created by alex on 6/3/16.
 */

import httpStatus from 'http-status';
import bcrypt from 'bcrypt-nodejs';
import mung from 'express-mung';

// Wrap response into `error`
export const sendError = (err, res, status) =>
  res.status(status || httpStatus.INTERNAL_SERVER_ERROR).json({error: err});

// Wrap response into `data`
export const sendData = (data, res, status) =>
  res.status(status || httpStatus.OK).json({data: data});

// Function for generating hash based on time
export const generateHash = () =>
  bcrypt.hashSync(Date.now().toString(), bcrypt.genSaltSync(), null);

// Wrap response into `data`
export const mungJson = mung.json((body) => {return {data: body}});

// Exception handling
export const mungCustomError = () => mung.onError = (err, req, res) => sendError(err, res);
