'use strict';


require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const httpStatus = require('http-status');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const config = require('./config/config');
const _portSocket = config.APP_PORT || process.env.PORT;

const server = http.createServer(app);

server.listen(_portSocket, function () {
  console.info('Express server listening on %d, in %s mode', _portSocket, app.get('env'));
});

server.on('connection', (s) => {
  console.log('A new connection was made by a client.');
});

server.on('error', (e) => {
  console.error('Error in HTTP Server >>', e);
});

try {
  fs.mkdirSync(__dirname + '/log');
} catch (e) {
  if (e.code !== 'EEXIST') {
      console.error('Could not set up log directory, error was: ', e);
  }
}

// handle app level errors
app.use(function (error, req, res, next) {
  console.debug(error.stack);
  console.error({ err: error }, 'JSON syntax error');
  if (error instanceof SyntaxError && error.status === httpStatus.BAD_REQUEST) {
    // Handle the error here
    res
        .status(httpStatus.BAD_REQUEST)
        .json({ status: 'Failure', message: 'JSON syntax error' });
  } else {
    res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: 'Failure', message: error.message });
  }
  // Pass the error to the next middleware if it wasn't a JSON parse error
});

app.get('/health', function (req, res) {
  res.status(httpStatus.OK).json({
    message: `You are entering in the realm of tabble at ${new Date().toISOString()}. May the force be with you.`
  });
});
// handle uncaught exceptions
process.on('uncaughtException', r => {
  // handle the error safely
  console.error({ err: r }, 'uncaughtException');
  console.debug(r, 'uncaughtException');
});

process.on('unhandledRejection', r => {
  console.error({ err: r }, 'unhandledRejection');
  console.debug(r, 'unhandledRejection');
});

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' })); // parse application/json

require(`${modulesPath}/routes`)(app, eventEmitter);

module.exports = { app, server };
