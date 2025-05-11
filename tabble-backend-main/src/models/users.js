"use strict";

const dbModel = require("./db-model");
const collectionName = "users";
const mongoose = require("mongoose");

/** users Schema **/
const userSchema = {
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^\d{10,15}$/, // Allows 10-15 digit numbers.
    unique: true, // Enforces unique mobile numbers.
  },
  otp: {
    type: String,
    required: false,
    match: /^\d{4,6}$/, // Validates OTP as a 4-6 digit number.
  },
  dob: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  profilePicUrl: {
    type: String,
    required: false,
  },
  coverPicUrl: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
    trim: true, // Removes extra spaces from the string.
    minlength: 2,
    maxlength: 50,
  },
  bio: {
    type: String,
    required: false,
    trim: true,
    maxlength: 250, // Limits bio to 250 characters.
  },
  address: {
    type: String,
    required: false,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"], // Must be 'Point' for GeoJSON.
      required: false,
    },
    coordinates: {
      type: [Number], // Array of numbers [longitude, latitude].
      required: false,
      validate: {
        validator: (v) =>
          v.length === 2 && v.every((num) => typeof num === "number"),
        message: "Location must be an array of [longitude, latitude].",
      },
    },
  },
  allowPrivateChatMessages: {
    type: Boolean, default: true
  },
  blockedUsers: { type: [Number], default: [] },
  mutedUsers: { type: [Number], default: [] },
  favouriteGroups: { type: [Number], default: [] },
};

// Convert userSchema to a Mongoose Schema object
const schemaConfig = new mongoose.Schema(userSchema, {
  _id: false, // Disable Mongoose's automatic `_id` generation.
});

// Add a 2dsphere index for geospatial queries on the `location` field
schemaConfig.index({ location: "2dsphere" });
schemaConfig.index({ name: "text" });
schemaConfig.index({ mobileNumber: "text" });

const config = {
  counter: true,
  timestamps: true,
};

module.exports.model = new dbModel(collectionName, schemaConfig, config);

/**
 * Function to get user
 * @param conditions {Object} the condition query to be searched
 * @param selectparams {Object} the json object keys to be projected
 * @return {Array} array of document will be returned
 */
module.exports.getUserById = async function (id, selectparams) {
  return await exports.model.findById(id, selectparams);
};

module.exports.findUser = async function (conditions, selectparams) {
  return await exports.model.findOne(conditions, selectparams);
};

module.exports.findUsers = async function (conditions, selectparams) {
  return await exports.model.find(conditions, selectparams);
};

/**
 * Function to add user
 * @param data {Object} the json object to be added
 * @return {Object} new created document will be returned
 */
module.exports.addUser = async function (data) {
  return await exports.model.create(data);
};

/**
 * Function to update user
 * @param conditions {Object} the json object query
 * @param data {Object} the json object to be updated
 * @param options {Object} the json object options
 * @return {Object} updated document will be returned
 */
module.exports.updateUser = async (conditions, data, options) => {
  return await exports.model.update(conditions, data, options);
};
