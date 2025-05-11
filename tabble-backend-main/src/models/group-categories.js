"use strict";

const dbModel = require("./db-model");
const collectionName = "group-categories";

/** categories Schema **/
const categoriesSchema = {
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: { type: String, unique: true },
  createdBy: { type: Number },
  isActive: { type: Boolean, default: true },
};

const config = {
  timestamps: true,
  _id: false,
  counter: true,
};
  
module.exports.model = new dbModel(collectionName, categoriesSchema, config);

module.exports.findCategories = async function (conditions, selectparams) {
  return await exports.model.find(conditions, selectparams);
};

module.exports.addCategory = async function (data) {
  return await exports.model.create(data);
};

module.exports.updateCategory = async (conditions, data, options) => {
  return await exports.model.update(conditions, data, options);
};
