'use strict';

const express = require('express');
const router = express.Router();
const httpStatus = require('http-status');
const { errorHandler } = require(`${appRoot}/lib/errors`);
const ApiClient = require(`${modulesPath}/domain/connections/api-client`);
const { sendResponse } = require('../../../lib/response-mapper');
const client = new ApiClient();

module.exports = function (app, auth, commonValidator, eventEmitter) {
  router.use(auth.validateToken);

  router.post('/send-request', async (req, res) => {
    const incomingPayload = req.body || {};
    client.sendConnectionRequest(req.user.userId, incomingPayload).then(_user => {
      return sendResponse(res, httpStatus.OK, {}, 'Request Sent successfully');
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.put('/accept-reject', async (req, res) => {
    const incomingPayload = req.body || {};
    client.acceptRejectConnectionRequest(req.user.userId, incomingPayload).then(message => {
      return sendResponse(res, httpStatus.OK, {}, message);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/my-connections', async (req, res) => {
    client.getMyConnections(req.user.userId).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/my-connection-requests', async (req, res) => {
    client.getMyConnectionRequests(req.user.userId).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });
  app.use('/connections', router);
};
