'use strict';

const { userStorageFactory } = require('../storage');

const defaultRepo = () => {
  return {
    userRepository: userStorageFactory.repository,
  };
};

class AuthProvider {

  constructor({ userRepository } = defaultRepo()) {
    this.userRepository = userRepository;
  }

  async findUser(conditions) {
    const selectparams = { _id: 1, countryCode: 1, mobileNumber: 1, otp: 1 };
    const userDetails = await this.userRepository.findUser(conditions, selectparams);
    return userDetails;
  }

  async addNewUser(payload) {
    return await this.userRepository.addUser(payload);
  }

  async updateUserOtp(userId, newOtp) {
    return await this.userRepository.updateUser(userId, { otp: newOtp });
  }
}

module.exports = {
  AuthProvider
};
