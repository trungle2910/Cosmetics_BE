// utilsHelper.sendResponse = (res, status, success, data, errors, message) => {
//   const response = {};
//   if (success) response.success = success; //response = {success:true}
//   if (data) response.data = data; // response = {success:true,data:{user}}
//   if (errors) response.errors = errors; // response = {success:true,data:{user}}
//   if (message) response.message = message; //response = {success:true,data:{user},message:"Login success"}
//   res.status(status).json(response);
// };
// module.exports = utilsHelper;

// /* utilsHelper.sendResponse(res,200,true,{ user },null,"Login success"); */

"use strict";

const crypto = require("crypto");
const utilsHelper = {};

// This function controls the way we response to the client
// If we need to change the way to response later on, we only need to handle it here
utilsHelper.sendResponse = (res, status, success, data, errors, message) => {
  const response = {};
  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (message) response.message = message;
  res.status(status).json(response);
};

utilsHelper.generateRandomHexString = (len) => {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString("hex")
    .slice(0, len)
    .toUpperCase();
};

// Error handling
utilsHelper.catchAsync = (func) => (req, res, next) =>
  func(req, res, next).catch((err) => next(err));

class AppError extends Error {
  constructor(statusCode, message, errorType) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    // all errors using this class are operational errors.
    this.isOperational = true;
    // create a stack trace for debugging (Error obj, void obj to avoid stack polution)
    Error.captureStackTrace(this, this.constructor);
  }
}

utilsHelper.AppError = AppError;
module.exports = utilsHelper;
