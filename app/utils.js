/**
 * Created by alex on 6/3/16.
 */

import httpStatus from 'http-status';
import mung from 'express-mung';
import uuid from 'uuid';

// Wrap response into `error`
export const sendError = (err, res, status) =>
  res.status(status || httpStatus.INTERNAL_SERVER_ERROR).json({error: err});

// Wrap response into `data`
export const sendData = (data, res, status) =>
  res.status(status || httpStatus.OK).json({data: data});

// Function for generating hash based on time
export const generateHash = () => uuid();

// Wrap response into `data`
export const mungJson = mung.json((body, req, res) => {
  if (!body) res.status(httpStatus.NOT_FOUND);
  return {data: body};
});

// Exception handling
export const mungCustomError = () => mung.onError = (err, req, res) => sendError(err, res, err.status);
