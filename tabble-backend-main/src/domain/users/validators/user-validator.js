'use strict';

const { Validator } = require(`${appRoot}/lib/validator`);
const user = require('./user-schema');

class UserValidator extends Validator {

  async validatePutPayload(payload) {
    return this.validate(payload, user.userPutSchema);
  }

  async validateAllowPrivateChatMessagesPayload(payload) {
    return this.validate(payload, user.allowPrivateChatMessagesSchema);
  }

  async validateBlockUnblockUsersPayload(payload) {
    return this.validate(payload, user.blockUnblockUsersSchema);
  }

  async validateMuteUnmuteUsersPayload(payload) {
    return this.validate(payload, user.muteUnmuteUsersSchema);
  }

}

module.exports = {
  UserValidator
};
