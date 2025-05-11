'use strict';

const { RepositoryFactory } = require(`${appRoot}/lib/factories/repository-factory`);
const { UserRepository } = require('./user-repository');
const { SessionRepository } = require('./session-repository');
const userStorageFactory = new RepositoryFactory(UserRepository);
const sessionStorageFactory = new RepositoryFactory(SessionRepository);

module.exports = {
  userStorageFactory,
  UserRepository,
  sessionStorageFactory,
  SessionRepository
};
