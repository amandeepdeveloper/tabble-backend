"use strict";

const createAccountSchema = {
  type: "object",
  properties: {
    dob: { type: "string", format: "date" },
    countryCode: { type: "string", minLength: 1 },
    mobileNumber: { type: "string", minLength: 10 },
  },
  required: ["dob", "countryCode", "mobileNumber"],
};

const getOtpSchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 1 },
  },
  required: ["username"],
};

const verifyOtpSchema = {
  type: "object",
  properties: {
    countryCode: { type: "string", minLength: 1 },
    mobileNumber: { type: "string", minLength: 10 },
    username: { type: "string", minLength: 1 },
    otp: { type: "string", minLength: 6, maxLength: 6 }
  },
  required: ["otp"],
  anyOf: [
    { required: ["username"] },
    { required: ["countryCode", "mobileNumber"] }
  ]
};

module.exports = {
  createAccountSchema,
  getOtpSchema,
  verifyOtpSchema
};
