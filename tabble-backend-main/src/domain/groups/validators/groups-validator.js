"use strict";

const { Validator } = require(`${appRoot}/lib/validator`);
const groups = require("./groups-schema");

class GroupsValidator extends Validator {
  async validateCreateGroupPayload(payload) {
    return this.validate(payload, groups.createGroupSchema);
  }

  async validateMarkUnmarkGroupAsFavoritePayload(payload) {
    return this.validate(
      payload,
      groups.markUnmarkGroupAsFavoriteSchema
    );
  }

  async validateRemoveUserFromGroupPayload(payload) {
    return this.validate(
      payload,
      groups.removeUserFromGroupSchema
    );
  }

  async validateBlockUserFromGroupPayload(payload) {
    return this.validate(
      payload,
      groups.blockUserFromGroupSchema
    );
  }

  async validateGroupCategoryPayload(payload) {
    return this.validate(
      payload,
      groups.groupCategorySchema
    );
  }
}

module.exports = {
  GroupsValidator,
};
