"use strict";

const { UserProvider } = require("./providers");
const { UserValidator } = require("./validators");

class apiClient {
  constructor() {
    this.userProvider = new UserProvider();
    this.userValidator = new UserValidator();
  }

  async logoutUser({ userId, sessionId }) {
    return await this.userProvider.deleteSession(userId, sessionId);
  }

  async fetchProfileDetails(userId) {
    return await this.userProvider.getUserById(userId)
  }

  async updateUserProfile(userId, incomingPayload) {
    await this.userValidator.validatePutPayload(incomingPayload);
    await this.userProvider.updateUser(userId, incomingPayload);
    return await this.userProvider.getUserById(userId);
  }

  async allowPrivateChatMessages(userId, incomingPayload) {
    await this.userValidator.validateAllowPrivateChatMessagesPayload(
      incomingPayload
    );
    await this.userProvider.allowPrivateChatMessages(userId, incomingPayload);
    return await this.userProvider.getUserById(userId);
  }

  async blockUnblockUsers(userId, incomingPayload) {
    await this.userValidator.validateBlockUnblockUsersPayload(incomingPayload);
    await this.userProvider.blockUnblockUsers(userId, incomingPayload);
    return await this.userProvider.getUserById(userId);
  }

  async muteUnmuteUsers(userId, incomingPayload) {
    await this.userValidator.validateMuteUnmuteUsersPayload(incomingPayload);
    await this.userProvider.muteUnmuteUsers(userId, incomingPayload);
    return await this.userProvider.getUserById(userId);
  }

  async getAllBlockedUsers(userId) {
    return await this.userProvider.getAllBlockedUsers(userId);
  }

  async getAllMutedUsers(userId) {
    return await this.userProvider.getAllMutedUsers(userId);
  }

  async getAllUsersList(userId) {
    return await this.userProvider.getAllUsersList(userId);
  }
}

module.exports = apiClient;
