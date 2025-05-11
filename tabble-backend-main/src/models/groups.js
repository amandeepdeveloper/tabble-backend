"use strict";

const dbModel = require("./db-model");
const collectionName = "groups";
const mongoose = require("mongoose");

/** groups Schema **/
const groupSchema = {
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  createdBy: { type: Number },
  categoryId: { type: Number },
  name: { type: String },
  groupPicUrl: { trype: String },
  members: [{ type: Number }],
  blockedMembers: [{ type: Number }],
  city: {
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
  isActive: { type: Boolean, default: true }
};

// Convert groupSchema to a Mongoose Schema object
const schemaConfig = new mongoose.Schema(groupSchema, {
  _id: false, // Disable Mongoose's automatic `_id` generation.
});

// Add a 2dsphere index for geospatial queries on the `location` field
schemaConfig.index({ location: "2dsphere" });
schemaConfig.index({ name: "text" });
schemaConfig.index({ categoryId: 1 });

const config = {
  counter: true,
  timestamps: true,
};

module.exports.model = new dbModel(collectionName, schemaConfig, config);

module.exports.findGroups = async function (conditions, selectparams) {
  return await exports.model.find(conditions, selectparams);
};

module.exports.addGroup = async function (data) {
  return await exports.model.create(data);
};

module.exports.updateGroup = async (conditions, data, options) => {
  return await exports.model.update(conditions, data, options);
};

module.exports.aggregate = (stages) => {
  return new Promise((resolve, reject) => {
    exports.model.getAggregate(stages, function (err, docs) {
      if (err) {
        return reject(err);
      }
      return resolve(docs);
    });
  });
};
