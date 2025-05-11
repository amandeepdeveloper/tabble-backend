'use strict';

const express = require('express');
const router = express.Router();
const ApiClient = require(`${modulesPath}/domain/auth/api-client`);
const { errorHandler } = require(`${appRoot}/lib/errors`);
const { sendResponse } = require('../../../lib/response-mapper');
const httpStatus = require('http-status');
const client = new ApiClient();

module.exports = function (app, auth, commonValidator, eventEmitter) {
  router.post('/get-otp', async function getOtp(req, res) {
    return client.getOtp(req.body)
      .then(response => {
        return sendResponse(res, httpStatus.OK, response, 'OTP sent successfully');
      }).catch(err => {
        errorHandler(err, req, res);
      });
  });

  router.post('/create-account', async function getOtp(req, res) {
    return client.createAccount(req.body)
      .then(response => {
        return sendResponse(res, httpStatus.OK, response, 'OTP sent successfully');
      }).catch(err => {
        errorHandler(err, req, res);
      });
  });
  
  router.post('/verify-otp', async function verifyOtp(req, res) {
    return client.verifyOtp(req.body)
      .then(accessToken => {
        return sendResponse(res, httpStatus.OK, { accessToken });
      }).catch(err => {
        errorHandler(err, req, res);
      });
  });

  app.use('/auth', router);
};
