'use strict';

const { Users } = require(`${modelsPath}`);

const defaultModel = () => {
  return Users;
};

class UserRepository {

  constructor(Users = defaultModel()) {
    this.Users = Users;
  }

  async findUser(conditions, selectparams = {}) {
    return await this.Users.findUser(conditions, selectparams);
  }

  async addUser(payload) {
    return await this.Users.addUser(payload);
  }

  async updateUser(userId, payload, options = {}) {
    return await this.Users.updateUser({ _id: userId }, payload, options);
  }
}

module.exports = {
  UserRepository
};
