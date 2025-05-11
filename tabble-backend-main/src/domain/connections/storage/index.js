'use strict';

const { RepositoryFactory } = require(`${appRoot}/lib/factories/repository-factory`);
const { UserRepository } = require('./user-repository');
const { ConnectionsRepository } = require('./connections-repository');
const userStorageFactory = new RepositoryFactory(UserRepository);
const connectionsStorageFactory = new RepositoryFactory(ConnectionsRepository);

module.exports = {
  userStorageFactory,
  UserRepository,
  connectionsStorageFactory,
  ConnectionsRepository
};
