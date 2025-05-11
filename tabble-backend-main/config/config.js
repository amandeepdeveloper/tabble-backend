'use strict';

const path = require('path');
const constants = require('./constants');

exports.ENV = process.env.NODE_ENV || 'development';

exports.APP_PORT = process.env.NODE_APP_PORT || constants.DEFAULT_APP_PORT;
exports.APP_HOST = process.env.NODE_APP_HOST || 'http://localhost';
exports.APP_BASE_URL = this.ENV !== 'development' ? this.APP_HOST : `${this.APP_HOST}:${this.APP_PORT}`;
const MONGO_PORT = process.env.MONGO_PORT || constants.DEFAULT_MONGO_PORT;
exports.MONGO_HOST = process.env.MONGO_HOST || `localhost:${MONGO_PORT}`;
exports.MONGO_PORT = MONGO_PORT;
exports.MONGO_DBNAME = process.env.MONGO_DBNAME || 'tabbleDevelopment';
exports.MONGO_REPLICASET_NAME = process.env.MONGO_REPLICASET_NAME || 'tabbleService';
exports.MONGO_USERNAME = '';
exports.MONGO_PASSWORD = '';
exports.MONGO_LOG_VERBOSE = process.env.hasOwnProperty('MONGO_LOG_VERBOSE')
  ? JSON.parse(process.env.MONGO_LOG_VERBOSE)
  : false;
exports.LOG_FILE_PATH = process.env.LOG_FILE_PATH || 'log/api.log';
exports.TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID;
exports.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN;
exports.TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER;
// exports.TWILIO_ACCOUNT_SID = 'ACc597f696da875b2c9ae445f71da9be18';
// exports.TWILIO_AUTH_TOKEN = '6869ebac874e0247dd1f0c2f14b77ad7';
// exports.TWILIO_PHONE_NUMBER = '+15705397752';
exports.JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRET;


global.appRoot = path.normalize(`${path.resolve(__dirname)}/..`);
global.modulesPath = `${appRoot}/src`;
global.modelsPath = `${modulesPath}/models`;
