"use strict";

const { AuthProvider, SessionProvider } = require("./providers");
const { AuthValidator } = require("./validators");
const config = require("../../../config/config");
const crypto = require("crypto");
const uuid = require("uuid");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");

// Twilio configuration
const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = config.TWILIO_PHONE_NUMBER;

class apiClient {
  constructor() {
    this.authProvider = new AuthProvider();
    this.sessionProvider = new SessionProvider();
    this.authValidator = new AuthValidator();
  }

  async createAccount(incomingPayload) {
    try {
      await this.authValidator.validateCreateAccountPayload(incomingPayload);
      incomingPayload.countryCode = incomingPayload.countryCode.trim();
      incomingPayload.mobileNumber = incomingPayload.mobileNumber.trim();
      const existingUser = await this.authProvider.findUser({
        countryCode: incomingPayload.countryCode,
        mobileNumber: incomingPayload.mobileNumber,
      });
      if (existingUser && existingUser._id) {
        const err = new Error("User already exists.");
        err.statusCode = httpStatus.BAD_REQUEST;
        throw err;
      }
      const otp = crypto.randomInt(100000, 999999).toString();
      incomingPayload.otp = otp;
      await this.authProvider.addNewUser(incomingPayload);
      await twilioClient.messages.create({
        body: `Your OTP for tabble is ${otp}`,
        from: twilioPhoneNumber,
        to: `${incomingPayload.countryCode}${incomingPayload.mobileNumber}`, // Ensure the identifier is a valid phone number
      });
      return {};
    } catch (err) {
      throw err;
    }
  }

  async getOtp(incomingPayload) {
    try {
      await this.authValidator.validateGetOtpPayload(incomingPayload);
      incomingPayload.username = incomingPayload.username.trim();
      const existingUser = await this.authProvider.findUser(incomingPayload);
      if (!existingUser || !existingUser._id) {
        const err = new Error("User with this username is not found");
        err.statusCode = httpStatus.FORBIDDEN;
        throw err;
      }
      const otp = crypto.randomInt(100000, 999999).toString();
      await this.authProvider.updateUserOtp(existingUser._id, otp);
      await twilioClient.messages.create({
        body: `Your OTP for tabble is ${otp}`,
        from: twilioPhoneNumber,
        to: `${existingUser.countryCode}${existingUser.mobileNumber}`, // Ensure the identifier is a valid phone number
      });
      return {};
    } catch (err) {
      throw err;
    }
  }

  async verifyOtp(incomingPayload) {
    try {
      await this.authValidator.validateVerifyOtpPayload(incomingPayload);
      if (incomingPayload.countryCode)
        incomingPayload.countryCode = incomingPayload.countryCode.trim();
      if (incomingPayload.mobileNumber)
        incomingPayload.mobileNumber = incomingPayload.mobileNumber?.trim();
      if (incomingPayload.username)
        incomingPayload.username = incomingPayload.username.trim();
      incomingPayload.otp = incomingPayload.otp.trim();
      const userDetails = await this.authProvider.findUser(incomingPayload);
      if (!userDetails) {
        throw new Error("Invalid or expired OTP");
      }
      // Create a new session
      const session = {
        sessionId: uuid.v4(),
        userId: userDetails._id,
      };
      await this.sessionProvider.addNewSession(session);
      // reset otp
      await this.authProvider.updateUserOtp(userDetails._id, "");
      // generate access token
      const accessToken = jwt.sign(session, config.JWT_SECRET, {
        expiresIn: "1h",
      });
      return accessToken;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = apiClient;
