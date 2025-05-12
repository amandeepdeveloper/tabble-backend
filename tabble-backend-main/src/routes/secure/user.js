'use strict';

const express = require('express');
const router = express.Router();
const httpStatus = require('http-status');
const { errorHandler } = require(`${appRoot}/lib/errors`);
const ApiClient = require(`${modulesPath}/domain/users/api-client`);
const { sendResponse } = require('../../../lib/response-mapper');
const client = new ApiClient();

module.exports = function (app, auth, commonValidator, eventEmitter) {
  router.use(auth.validateToken);

  router.put('/log-out', async (req, res) => {
    client.logoutUser(req.user).then(_user => {
      return sendResponse(res, httpStatus.OK, {}, 'user logged out successfully');
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.put('/update-profile', async (req, res) => {
    const incomingPayload = req.body || {};
    client.updateUserProfile(req.user.userId, incomingPayload).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/fetch-profile-details', async (req, res) => {
    client.fetchProfileDetails(req.user.userId).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.put('/allow-private-chat-messages', async (req, res) => {
    const incomingPayload = req.body || {};
    client.allowPrivateChatMessages(req.user.userId, incomingPayload).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.put('/block-unblock', async (req, res) => {
    const incomingPayload = req.body || {};
    client.blockUnblockUsers(req.user.userId, incomingPayload).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.put('/mute-unmute', async (req, res) => {
    const incomingPayload = req.body || {};
    client.muteUnmuteUsers(req.user.userId, incomingPayload).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/blocked', async (req, res) => {
    client.getAllBlockedUsers(req.user.userId).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/muted', async (req, res) => {
    client.getAllMutedUsers(req.user.userId).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/all', async (req, res) => {
    client.getAllUsersList(req.user.userId).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/allfavoritegroups', async (req, res) => {
    client.getAllFavoriteGroupList(req.user.userId).then(user => {
      return sendResponse(res, httpStatus.OK, user);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  app.use('/users', router);
};
