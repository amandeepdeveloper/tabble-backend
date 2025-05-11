"use strict";

const { Validator } = require(`${appRoot}/lib/validator`);
const connections = require("./connections-schema");

class ConnectionsValidator extends Validator {
  async validateSendConnectionRequestPayload(payload) {
    return this.validate(payload, connections.sendConnectionRequestSchema);
  }

  async validateAcceptRejectConnectionRequestPayload(payload) {
    return this.validate(
      payload,
      connections.acceptRejectConnectionRequestSchema
    );
  }
}

module.exports = {
  ConnectionsValidator,
};
