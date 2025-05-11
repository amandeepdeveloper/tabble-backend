'use strict';

const config = require(`${appRoot}/config/config`);
const bunyan = require('bunyan');

function reqSerializer(req) {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers
  };
}

class LoggerService {

  constructor(streamName= 'sbs') {
    this.logData = {};
    this.streamName = streamName;
    this.logGroupName = `tabble-logs-${config.ENV}`;

    const streams = [
      {
        level: config.LOG_LEVEL,
        path: config.LOG_FILE_PATH
      }
    ];

    const logger = bunyan.createLogger({
      name: this.streamName,
      streams,
      serializers: {
        req: reqSerializer
      }
    });

    this.logger = logger;
  }

  setLogData(logData) {
    this.logData = logData;
  }

  async info(message) {
    this.logger.info(this.logData, message);
  }

  async debug(message) {
    this.logger.debug(this.logData, message);
  }

  async error(message) {
    this.logger.error(this.logData, message);
  }

  async warn(message) {
    this.logger.warn(this.logData, message);
  }

}
module.exports = LoggerService;
