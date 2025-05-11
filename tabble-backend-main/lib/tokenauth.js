'use strict';

const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const { Sessions } = require(`${modelsPath}`);
const config = require(`${appRoot}/config/config`);
const Logger = require(`${appRoot}/lib/logger-service`);
const { sendResponse } = require('../lib/response-mapper');
const logger = new Logger();

exports.validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Authorization header missing' });
    }

    // Extract the token (expected format: "Bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Token missing from header' });
    }

    // Verify the token using the JWT secret
    jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return sendResponse(res, httpStatus.UNAUTHORIZED, {}, 'Invalid or expired token');
      }
      const { userId, sessionId } = decoded;
      // Check if the session exists in the database
      const sessionExists = await Sessions.findSession({ userId, sessionId }, { sessionId: 1 });
      if (!sessionExists || !sessionExists.sessionId) {
        return sendResponse(res, httpStatus.UNAUTHORIZED, {}, 'Session expired');
      }
      // Attach user data to the request object
      req.user = { userId, sessionId };
      // Proceed to the next middleware or route
      next();
    });
  } catch (err) {
    logger.setLogData(err);
    logger.error('Catch error in validate token');
    return sendResponse(res, httpStatus.UNAUTHORIZED, {}, err.message);
  }
};
