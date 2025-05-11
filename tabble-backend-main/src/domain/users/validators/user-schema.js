"use strict";

const userPutSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    username: { type: "string", minLength: 1 },
    email: { 
      type: "string", 
      minLength: 1,
      format: "email" // This ensures the email follows the standard email format
    },
    bio: { type: "string", minLength: 1 },
    latitude: { type: "number" },
    longitude: { type: "number" },
    profilePicUrl: { type: "string", minLength: 1 },
    coverPicUrl: { type: "string", minLength: 1 },
    address: { type: "string", minLength: 1 },
  },
  required: [],
};

const allowPrivateChatMessagesSchema = {
  type: "object",
  properties: {
    allow: { type: "boolean" },
  },
  required: ["allow"],
};

const blockUnblockUsersSchema = {
  type: "object",
  properties: {
    userIds: {
      type: "array", // The value must be an array
      items: { type: "number" }, // Each item in the array must be a number
      minItems: 1, // Minimum number of items in the array
      uniqueItems: true,
    },
    block: { type: "boolean" },
  },
  required: ["block", "userIds"],
};

const muteUnmuteUsersSchema = {
  type: "object",
  properties: {
    userIds: {
      type: "array", // The value must be an array
      items: { type: "number" }, // Each item in the array must be a number
      minItems: 1, // Minimum number of items in the array
      uniqueItems: true,
    },
    mute: { type: "boolean" },
  },
  required: ["mute", "userIds"],
};

module.exports = {
  userPutSchema,
  blockUnblockUsersSchema,
  allowPrivateChatMessagesSchema,
  muteUnmuteUsersSchema,
};
