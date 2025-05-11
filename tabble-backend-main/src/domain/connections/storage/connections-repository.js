"use strict";

const { Connections } = require(`${modelsPath}`);

const defaultModel = () => {
  return Connections;
};

class ConnectionsRepository {
  constructor(Connections = defaultModel()) {
    this.Connections = Connections;
  }

  async createNewConnection(payload) {
    return await this.Connections.addConnection(payload);
  }

  async getAggregatedConnections(conditions) {
    const pipeline = [
      {
        $match: conditions, // Apply the conditions to filter connections.
      },
      {
        $lookup: {
          from: "users", // The name of the users collection.
          localField: "senderId",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $lookup: {
          from: "users", // The name of the users collection.
          localField: "receiverId",
          foreignField: "_id",
          as: "receiverDetails",
        },
      },
      {
        $project: {
          _id: 1,
          senderDetails: {
            name: 1,
            bio: 1,
            profilePicUrl: 1,
            coverPicUrl: 1,
            address: 1,
          },
          receiverDetails: {
            name: 1,
            bio: 1,
            profilePicUrl: 1,
            coverPicUrl: 1,
            address: 1,
          },
        },
      },
    ];
    return await this.Connections.aggregate(pipeline);
  }

  async updateConnection(conditions, updatePayload, options) {
    return await this.Connections.updateConnection(conditions, updatePayload, options);
  }

  async findConnections(condition, selectparams = {}) {
    return await this.Connections.findConnections(condition, selectparams);
  }
}

module.exports = {
  ConnectionsRepository,
};
