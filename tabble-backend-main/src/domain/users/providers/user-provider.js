"use strict";

const { NotFoundError } = require(`${appRoot}/lib/errors`);
const { userStorageFactory, sessionStorageFactory } = require("../storage");
const { outboundUserTransformer } = require("../transformers");

const defaultRepo = () => {
  return {
    userRepository: userStorageFactory.repository,
    sessionRepository: sessionStorageFactory.repository,
  };
};

class UserProvider {
  constructor({ userRepository, sessionRepository } = defaultRepo()) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  async getUserById(userId) {
    const selectparams = {
      _id: 1,
      countryCode: 1,
      mobileNumber: 1,
      profilePicUrl: 1,
      coverPicUrl: 1,
      name: 1,
      bio: 1,
      address: 1,
      location: 1,
      allowPrivateChatMessages: 1,
      mutedUsers: 1,
      blockedUsers: 1,
      favouriteGroups: 1,
      username: 1,
      dob: 1,
      email: 1,
    };
    const userDetails = await this.userRepository.getUserById(
      userId,
      selectparams
    );
    if (!userDetails) {
      throw new NotFoundError("User not found");
    }
    return outboundUserTransformer.transform(userDetails);
  }

  async updateUser(userId, incomingPayload) {
    const updatePayload = {};
    if (incomingPayload.hasOwnProperty("name")) {
      updatePayload.name = incomingPayload.name;
    }
    if (incomingPayload.hasOwnProperty("bio")) {
      updatePayload.bio = incomingPayload.bio;
    }
    if (
      incomingPayload.hasOwnProperty("latitude") &&
      incomingPayload.hasOwnProperty("longitude")
    ) {
      updatePayload.location = {
        type: "Point",
        coordinates: [incomingPayload.longitude, incomingPayload.latitude],
      };
    }
    if (incomingPayload.hasOwnProperty("address")) {
      updatePayload.address = incomingPayload.address;
    }
    if (incomingPayload.hasOwnProperty("username")) {
      updatePayload.username = incomingPayload.username;
    }
    if (incomingPayload.hasOwnProperty("email")) {
      updatePayload.email = incomingPayload.email;
    }
    if (incomingPayload.hasOwnProperty("profilePicUrl")) {
      updatePayload.profilePicUrl = incomingPayload.profilePicUrl;
    }
    if (incomingPayload.hasOwnProperty("coverPicUrl")) {
      updatePayload.coverPicUrl = incomingPayload.coverPicUrl;
    }
    const conditions = { _id: userId };
    const option = {};
    await this.userRepository.updateUser(conditions, updatePayload, option);
    return true;
  }

  async allowPrivateChatMessages(userId, incomingPayload) {
    const conditions = { _id: userId };
    const option = {};
    await this.userRepository.updateUser(
      conditions,
      { allowPrivateChatMessages: incomingPayload.allow },
      option
    );
    return true;
  }

  async blockUnblockUsers(userId, incomingPayload) {
    const conditions = { _id: userId };
    let updatePayload = {};
    if (incomingPayload.block) {
      updatePayload = {
        $addToSet: { blockedUsers: { $each: incomingPayload.userIds } },
      };
    } else {
      updatePayload = {
        $pull: { blockedUsers: { $in: incomingPayload.userIds } },
      };
    }
    await this.userRepository.updateUser(
      conditions,
      updatePayload,
      {}
    );
    return true;
  }

  async muteUnmuteUsers(userId, incomingPayload) {
    const conditions = { _id: userId };
    let updatePayload = {};
    if (incomingPayload.mute) {
      updatePayload = {
        $addToSet: { mutedUsers: { $each: incomingPayload.userIds } },
      };
    } else {
      updatePayload = {
        $pull: { mutedUsers: { $in: incomingPayload.userIds } },
      };
    }
    await this.userRepository.updateUser(
      conditions,
      updatePayload,
      {}
    );
    return true;
  }

  async getAllMutedUsers(userId) {
    try {
      const { mutedUsers } = await this.userRepository.getUserById(userId);
      if (!mutedUsers || mutedUsers.length === 0) {
        return []; // No muted users
      }
      const selectParams = { _id: 1, name: 1, profilePicUrl: 1, bio: 1, countryCode: 1, mobileNumber: 1 }
      return await this.userRepository.findUsers({_id: { $in: mutedUsers } }, selectParams);
    } catch (error) {
      console.error("Error fetching muted users:", error);
      throw error;
    }
  }

  async getAllBlockedUsers(userId) {
    try {
      const { blockedUsers } = await this.userRepository.getUserById(userId);
      if (!blockedUsers || blockedUsers.length === 0) {
        return []; // No blocked users
      }
      const selectParams = { _id: 1, name: 1, profilePicUrl: 1, bio: 1, countryCode: 1, mobileNumber: 1 }
      return await this.userRepository.findUsers({_id: { $in: blockedUsers } }, selectParams);
    } catch (error) {
      console.error("Error fetching muted users:", error);
      throw error;
    }
  }

  async deleteSession(userId, sessionId) {
    const conditions = { userId, sessionId };
    await this.sessionRepository.deleteSession(conditions);
    return true;
  }

  async getAllUsersList(userId, search) {
    try {
      const query = {
        blockedUsers: { $ne: userId }, // Check that userId is NOT in the blockedUsers array.
      };
      
      const projection = {
        _id: 1,
        name: 1,
        bio: 1,
        profilePicUrl: 1,
        coverPicUrl: 1,
        address: 1,
        countryCode: 1, 
        mobileNumber: 1 
      };
      return await this.userRepository.findUsers(query, projection);
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }
}

module.exports = {
  UserProvider,
};
