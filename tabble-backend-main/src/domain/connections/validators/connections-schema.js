"use strict";

const sendConnectionRequestSchema = {
  type: "object",
  properties: {
    receiverId: { type: "number", minLength: 1 }
  },
  required: ["receiverId"],
};

const acceptRejectConnectionRequestSchema = {
  type: "object",
  properties: {
    connectionRequestId: { type: "number" },
    accept: { type: "boolean" },
  },
  required: ["accept", "connectionRequestId"],
};

module.exports = {
  sendConnectionRequestSchema,
  acceptRejectConnectionRequestSchema,
};
