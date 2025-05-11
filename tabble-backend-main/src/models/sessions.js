'use strict';

const dbModel = require('./db-model');

const collectionName = 'sessions';
const sessionSchema = {
  userId: { type: Number },
  sessionId: { type: String },
};

const config = {
  timestamps: true
};

module.exports.model = new dbModel(collectionName, sessionSchema, config);

module.exports.addSession = async function (data) {
  return await exports.model.create(data);
};

module.exports.findSession = async (conditions, selectParams) => {
  return await exports.model.findOne(conditions, selectParams);
};

module.exports.deleteSessions = async function (conditions) {
  return await exports.model.deleteMany(conditions);
};
