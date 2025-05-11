"use strict";

const dbModel = require("./db-model");
const collectionName = "connections";

/** connections Schema **/
const connectionSchema = {
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  senderId: { type: Number },
  receiverId: { type: Number },
  isAccepted: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
};

const config = {
  timestamps: true,
  _id: false,
  counter: true,
};
  
module.exports.model = new dbModel(collectionName, connectionSchema, config);

module.exports.findConnections = async function (conditions, selectparams) {
  return await exports.model.find(conditions, selectparams);
};

module.exports.addConnection = async function (data) {
  return await exports.model.create(data);
};

module.exports.updateConnection = async (conditions, data, options) => {
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
