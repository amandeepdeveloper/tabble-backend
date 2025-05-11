'use strict';

const { Users } = require(`${modelsPath}`);

const defaultModel = () => {
  return Users;
};

class UserRepository {

  constructor(Users = defaultModel()) {
    this.Users = Users;
  }

  async getUserById(userId, selectparams = {}) {
    return await this.Users.getUserById(userId, selectparams);
  }

  async findUsers(condition, selectparams = {}) {
    return await this.Users.findUsers(condition, selectparams);
  }

  async updateUser(conditions, userData, options) {
    return await this.Users.updateUser(conditions, userData, options);
  }
}

module.exports = {
  UserRepository
};
