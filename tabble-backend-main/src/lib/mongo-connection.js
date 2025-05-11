'use strict';

const mongoose = require('mongoose');
const config = require(`${appRoot}/config/config`);
const Schema = mongoose.Schema;

/* eslint-disable-next-line */
let connectionInstance;
//if already we have a connection, don't connect to database again
if (connectionInstance) {
  module.exports.connectionInstance = connectionInstance;
  module.exports.Schema = Schema;
}

const connectionString = `mongodb://${config.MONGO_HOST}/${config.MONGO_DBNAME}`;
let options = {};
if (config.ENV != 'development' && config.ENV != 'test') {
  options = {
    poolSize: 50,
    replicaSet: config.MONGO_REPLICASET_NAME,
    socketTimeoutMS: 300000,
    keepAlive: 600000,
    connectTimeoutMS: 300000
  };
}

connectionInstance = mongoose.createConnection(connectionString, options);

//error connecting to db
connectionInstance.on('error', function(err) {
  if (err) {
    throw err;
  }
});
//db connected
connectionInstance.once('open', function() {
  /* eslint-disable-next-line */
  console.info('MongoDb connected successfully, date is = ' + new Date());
});

//export the db connection
module.exports.connectionInstance = connectionInstance;
module.exports.Schema = Schema;
const logDebug = config.MONGO_LOG_VERBOSE || false;
mongoose.set('debug', logDebug);
