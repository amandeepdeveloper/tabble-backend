"use strict";

const { Validator } = require(`${appRoot}/lib/validator`);
const authSchema = require("./auth-schema");

class AuthValidator extends Validator {
  async validateGetOtpPayload(payload) {
    return this.validate(payload, authSchema.getOtpSchema);
  }
  async validateCreateAccountPayload(payload) {
    return this.validate(payload, authSchema.createAccountSchema);
  }

  async validateVerifyOtpPayload(payload) {
    return this.validate(payload, authSchema.verifyOtpSchema);
  }
}

module.exports = {
  AuthValidator,
};
