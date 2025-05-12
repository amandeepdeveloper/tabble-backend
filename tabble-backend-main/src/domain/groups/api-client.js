"use strict";

const { GroupsProvider } = require("./providers");
const { GroupCategoriesProvider } = require("./providers");
const { GroupsValidator } = require("./validators");

class apiClient {
  constructor() {
    this.groupsProvider = new GroupsProvider();
    this.groupCategoriesProvider = new GroupCategoriesProvider();
    this.groupsValidator = new GroupsValidator();
  }

  async createGroup(userId, incomingPayload) {
    await this.groupsValidator.validateCreateGroupPayload(incomingPayload);
    await this.groupsProvider.createGroup(userId, incomingPayload);
    return true;
  }

  async findGroups(userId, myGroups, query = {}) {
    return await this.groupsProvider.findGroups(userId, myGroups, query);
  }

  async markUnmarkGroupAsFavourite(userId, groupId, incomingPayload) {
    await this.groupsValidator.validateMarkUnmarkGroupAsFavoritePayload(incomingPayload);
    return await this.groupsProvider.markUnmarkGroupAsFavourite(userId, groupId, incomingPayload);
  }

  async removeUserFromGroup(requestUserId, groupId, incomingPayload) {
    await this.groupsValidator.validateRemoveUserFromGroupPayload(incomingPayload);
    return await this.groupsProvider.removeUserFromGroup(requestUserId, groupId, incomingPayload.userId);
  }

  async joinInTheGroup(requestUserId, groupId) {
    return await this.groupsProvider.joinInTheGroup(requestUserId, groupId);
  }

  async blockUnblockUserFromGroup(requestUserId, groupId, incomingPayload) {
    await this.groupsValidator.validateBlockUserFromGroupPayload(incomingPayload);
    return await this.groupsProvider.blockUnblockUserFromGroup(requestUserId, groupId, incomingPayload.userId, incomingPayload.block);
  }

  async deleteGroup(userId, groupId) {
    return await this.groupsProvider.deleteGroup(userId, groupId);
  }

  async createGroupCategory(userId, incomingPayload) {
    await this.groupsValidator.validateGroupCategoryPayload(incomingPayload);
    await this.groupCategoriesProvider.createGroupCategory(userId, incomingPayload)
    return true;
  }

  async findGroupCategories(search) {
    return await this.groupCategoriesProvider.findGroupCategories(search);
  }

  async updateGroupCategory(userId, categoryId, incomingPayload) {
    await this.groupsValidator.validateGroupCategoryPayload(incomingPayload);
    return await this.groupCategoriesProvider.updateGroupCategory(userId, categoryId, incomingPayload.name);
  }

  async findGroupIsTrue(groupId) {
    return await this.groupsProvider.findGroupIsTrue(groupId);
  }

  async deleteGroupCategory(userId, categoryId) {
    return await this.groupCategoriesProvider.deleteGroupCategory(userId, categoryId);
  }

}

module.exports = apiClient;
