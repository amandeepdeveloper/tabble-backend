'use strict';

const httpStatus = require('http-status');

const { UniqueIndexError } = require('./unique-index-error');
const { AuthenticationError } = require('./authentication-error');
const { NotFoundError } = require('./not-found-error');
const { ValidationError } = require('./validation-error');
const { BadRequestError } = require('./bad-request-error');

const errorMap = {
  ValidationError: httpStatus.UNPROCESSABLE_ENTITY,
  UniqueIndexError: httpStatus.UNPROCESSABLE_ENTITY,
  NotFoundError: httpStatus.NOT_FOUND,
  AuthenticationError: httpStatus.FORBIDDEN,
  BadRequestError: httpStatus.BAD_REQUEST
};

function getMessage(err) {
  if (err.errors) {
    return Object.keys(err.errors).map(k => err.errors[k].message).join(', ');
  }

  return err.message;
}

function errorHandler (err, req, res, next) {
  const statusCode = errorMap[err.name] || err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = getMessage(err);

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
}

module.exports = {
  errorHandler,
  UniqueIndexError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  BadRequestError
};
