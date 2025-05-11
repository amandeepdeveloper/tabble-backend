'use strict';

const express = require('express');
const router = express.Router();
const httpStatus = require('http-status');
const { errorHandler } = require(`${appRoot}/lib/errors`);
const ApiClient = require(`${modulesPath}/domain/groups/api-client`);
const { sendResponse } = require('../../../lib/response-mapper');
const client = new ApiClient();

module.exports = function (app, auth, commonValidator, eventEmitter) {
  router.use(auth.validateToken);

  router.post('/create', async (req, res) => {
    const incomingPayload = req.body || {};
    client.createGroup(req.user.userId, incomingPayload).then(_group => {
      return sendResponse(res, httpStatus.OK, {}, 'Group Created successfully');
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/my-groups', async (req, res) => { // location, category, name
    client.findGroups(req.user.userId, true, req.query).then(groups => {
      return sendResponse(res, httpStatus.OK, groups);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/all', async (req, res) => { // location, category, name
    client.findGroups(req.user.userId, false, req.query).then(groups => {
      return sendResponse(res, httpStatus.OK, groups);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.put('/:id/mark-unmark-favourite', async (req, res) => {
    const incomingPayload = req.body || {};
    client.markUnmarkGroupAsFavourite(req.user.userId, Number(req.params.id), incomingPayload).then(message => {
      return sendResponse(res, httpStatus.OK, {}, message);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.put('/:id/join', async (req, res) => {
    client.joinInTheGroup(req.user.userId, Number(req.params.id)).then(message => {
      return sendResponse(res, httpStatus.OK, {}, message);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.put('/:id/remove-user', async (req, res) => {
    const incomingPayload = req.body || {};
    client.removeUserFromGroup(req.user.userId, Number(req.params.id), incomingPayload).then(message => {
      return sendResponse(res, httpStatus.OK, {}, message);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.put('/:id/block-unblock-user', async (req, res) => {
    const incomingPayload = req.body || {};
    client.blockUnblockUserFromGroup(req.user.userId, Number(req.params.id), incomingPayload).then(message => {
      return sendResponse(res, httpStatus.OK, {}, message);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.delete('/:id', async (req, res) => {
    client.deleteGroup(req.user.userId, Number(req.params.id)).then(message => {
      return sendResponse(res, httpStatus.OK, {}, message);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });
  
  router.post('/category', async (req, res) => {
    const incomingPayload = req.body || {};
    client.createGroupCategory(req.user.userId, incomingPayload).then(_category => {
      return sendResponse(res, httpStatus.OK, {}, 'Group Category Created successfully');
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });
  
  router.put('/category/:id', async (req, res) => {
    const incomingPayload = req.body || {};
    client.updateGroupCategory(req.user.userId, req.params.id, incomingPayload).then(_category => {
      return sendResponse(res, httpStatus.OK, {}, 'Group Category Updated successfully');
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });
  
  router.delete('/category/:id', async (req, res) => {
    client.deleteGroupCategory(req.user.userId, req.params.id).then(_category => {
      return sendResponse(res, httpStatus.OK, {}, 'Group Category Deleted successfully');
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  router.get('/category/all', async (req, res) => { // search
    client.findGroupCategories(req.query.search).then(categories => {
      return sendResponse(res, httpStatus.OK, categories);
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });

  app.use('/groups', router);
};
