"use strict";

const { GroupCategories } = require(`${modelsPath}`);

const defaultModel = () => {
  return GroupCategories;
};

class GroupCategoriesRepository {
  constructor(GroupCategories = defaultModel()) {
    this.GroupCategories = GroupCategories;
  }

  async createGroupCategory(payload) {
    return await this.GroupCategories.addCategory(payload);
  }

  async updateGroupCategory(conditions, updatePayload, options) {
    return await this.GroupCategories.updateCategory(
      conditions,
      updatePayload,
      options
    );
  }

  async findGroupCategories(conditions, selectParams) {
    return await this.GroupCategories.findCategories(conditions, selectParams);
  }
}

module.exports = {
  GroupCategoriesRepository,
};
