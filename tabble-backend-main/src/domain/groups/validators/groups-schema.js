"use strict";

const createGroupSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    categoryId: { type: "number" },
    latitude: { type: "number" },
    longitude: { type: "number" },
    city: { type: "string", minLength: 1 },
    groupPicUrl: { type: "string", minLength: 1 }
  },
  required: ["name", "latitude", "longitude", "city", "groupPicUrl"],
};

const markUnmarkGroupAsFavoriteSchema = {
  type: "object",
  properties: {
    favourite: { type: "boolean" },
  },
  required: ["favourite"],
};

const removeUserFromGroupSchema = {
  type: "object",
  properties: {
    userId: { type: "number" },
  },
  required: ["userId"],
};

const blockUserFromGroupSchema = {
  type: "object",
  properties: {
    userId: { type: "number" },
    block: { type: "boolean" }
  },
  required: ["userId", "block"],
};

const groupCategorySchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
  },
  required: ["name"],
};

module.exports = {
  createGroupSchema,
  markUnmarkGroupAsFavoriteSchema,
  removeUserFromGroupSchema,
  blockUserFromGroupSchema,
  groupCategorySchema
};
