const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {
    phoneNumber: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    sessionId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);
