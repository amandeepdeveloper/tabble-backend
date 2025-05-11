'use strict';

const express = require('express');
const router = express.Router();
const httpStatus = require('http-status');
const { errorHandler } = require(`${appRoot}/lib/errors`);
const ApiClient = require(`${modulesPath}/domain/file-upload/api-client`);
const { sendResponse } = require('../../../lib/response-mapper');
const { upload, processImage } = require('../../lib/upload');
const client = new ApiClient();

module.exports = function (app, auth, commonValidator, eventEmitter) {
  router.use(auth.validateToken);

  router.put('/upload', upload.single('file'), processImage, async (req, res) => {
    client.uploadFile(req.user.userId, req.file).then(url => {
      return sendResponse(res, httpStatus.OK, { url }, 'File uploaded successfully');
    }).catch(err => {
      errorHandler(err, req, res);
    });
  });
  app.use('/file', router);
};
