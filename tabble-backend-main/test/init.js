'use strict';

function overrideConsoleMethods() {
  /* eslint-disable no-console */
  console.error = function() {};
  console.warn = function() {};
  console.info = function() {};
  console.debug = function() {};
  /* eslint-enable no-console */
}

function setEnvironmentals() {
  process.env.NODE_APP_PORT = 3003;
  process.env.ENV ='test';
  process.env.MONGO_DBNAME = 'testTabble';
  process.env.NODE_EMAIL_ENABLED = false;
}

function getAppRoot() {
  const path = require('path');
  return path.normalize(`${path.resolve(__dirname)}'/..`);
}

function setGlobalPaths(appRoot) {
  global.appRoot = appRoot;
  global.modelsPath = `${appRoot}/src/models`;
  global.test = `${appRoot}/test`;
  global.modulesPath = `${appRoot}/src`;
}


function prepareForTests() {
  const appRoot = getAppRoot();
  setEnvironmentals();
  setGlobalPaths(appRoot);
  overrideConsoleMethods();
}

prepareForTests();
