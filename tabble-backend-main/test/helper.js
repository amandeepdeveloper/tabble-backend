'use strict';

global.app = {};
global.server = {};
global.agent = {};
global.config = {};

before(() => {
  const supertest = require('supertest');
  const {
    app,
    server
  } = require(`${appRoot}/server.js`);
  const config = require(`${appRoot}/config/config.js`);
  const agent = supertest.agent(server);
  global.config = config;
  global.app = app;
  global.server = server;
  global.agent = agent;
});

after(async () => {
  if (process.env.NODE_ENV == 'test') {
    const connection = require(`${modulesPath}/lib/mongo-connection`).connectionInstance;
    const collections = await connection.db.collections();
    for (const collection of collections) {
      await collection.remove();
    }
  }
  server.close();
});
