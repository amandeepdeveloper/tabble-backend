"use strict";

const { NotFoundError } = require(`${appRoot}/lib/errors`);
const { connectionsStorageFactory, userStorageFactory } = require("../storage");

const defaultRepo = () => {
  return {
    userRepository: userStorageFactory.repository,
    connectionsRepository: connectionsStorageFactory.repository,
  };
};

class ConnectionsProvider {
  constructor({ connectionsRepository, userRepository } = defaultRepo()) {
    this.connectionsRepository = connectionsRepository;
    this.userRepository = userRepository;
  }

  async createConnectionRequest(senderId, { receiverId }) {
    // check if valid receiver id
    const userDetails = await this.userRepository.getUserById(receiverId, {
      _id: 1,
    });
    if (!userDetails || senderId === receiverId) {
      throw new NotFoundError("Invalid Receiver ID");
    }
    // create new connection request
    const payload = {
      senderId,
      receiverId,
      isAccepted: false,
      isRejected: false
    };
    return await this.connectionsRepository.createNewConnection(payload);
  }

  async getMyConnectionRequests(userId, search) {
    try {
      const conditions = {
        receiverId: userId,
        isAccepted: false,
        isRejected: false
      };
      return await this.connectionsRepository.getAggregatedConnections(conditions);
    } catch (error) {
      console.error("Error fetching connections:", error);
      throw error;
    }
  }

  async acceptRejectConnectionRequest(userId, { connectionRequestId, accept }) {
    // check if valid connection id
    const conditions = { _id: connectionRequestId, receiverId: userId, isAccepted: false, isRejected: false };
    const connections = await this.connectionsRepository.findConnections(conditions, {
      _id: 1,
    });
    if (!connections?.length) {
      throw new NotFoundError("Connection request not found");
    }
    // accept/reject connection
    const updatePayload = {
      isAccepted: accept,
      isRejected: !accept
    }
    await this.connectionsRepository.updateConnection(
      conditions,
      updatePayload,
      {}
    );
    return `Request ${accept ? 'accepted' : 'rejected'} successfully`;
  }

  async getMyConnections(userId, search) {
    try {
      const conditions = {
        $or: [
          {
            senderId: userId
          },
          {
            receiverId: userId
          }
        ],
        isAccepted: true,
        isRejected: false
      };
      return await this.connectionsRepository.getAggregatedConnections(conditions);
    } catch (error) {
      console.error("Error fetching connections:", error);
      throw error;
    }
  }
}

module.exports = {
  ConnectionsProvider,
};
