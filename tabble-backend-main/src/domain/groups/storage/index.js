'use strict';

const { RepositoryFactory } = require(`${appRoot}/lib/factories/repository-factory`);
const { UserRepository } = require('./user-repository');
const { GroupsRepository } = require('./groups-repository');
const { GroupCategoriesRepository } = require('./group-categories-repository');
const userStorageFactory = new RepositoryFactory(UserRepository);
const groupsStorageFactory = new RepositoryFactory(GroupsRepository);
const groupCategoriesStorageFactory = new RepositoryFactory(GroupCategoriesRepository);

module.exports = {
  userStorageFactory,
  UserRepository,
  groupsStorageFactory,
  GroupsRepository,
  groupCategoriesStorageFactory,
  GroupCategoriesRepository
};
