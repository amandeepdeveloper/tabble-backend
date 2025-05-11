"use strict";

const { ConnectionsProvider } = require("./providers");
const { ConnectionsValidator } = require("./validators");

class apiClient {
  constructor() {
    this.connectionsProvider = new ConnectionsProvider();
    this.connectionsValidator = new ConnectionsValidator();
  }

  async sendConnectionRequest(userId, incomingPayload) {
    await this.connectionsValidator.validateSendConnectionRequestPayload(incomingPayload);
    await this.connectionsProvider.createConnectionRequest(userId, incomingPayload);
    return true;
  }

  async acceptRejectConnectionRequest(userId, incomingPayload) {
    await this.connectionsValidator.validateAcceptRejectConnectionRequestPayload(incomingPayload);
    return await this.connectionsProvider.acceptRejectConnectionRequest(userId, incomingPayload);
  }

  async getMyConnections(userId, search) {
    return await this.connectionsProvider.getMyConnections(userId, search);
  }

  async getMyConnectionRequests(userId, search) {
    return await this.connectionsProvider.getMyConnectionRequests(userId, search);
  }

}

module.exports = apiClient;
