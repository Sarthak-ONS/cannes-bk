const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const otpExpiry = parseInt(process.env.OTP_EXPIRY || 300);

console.log(process.env.TWILIO_PHONE_NUMBER);

const client = require("twilio")(accountSid, authToken);

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error(
    "Missing Twilio credentials. Make sure to set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in the environment variables."
  );
  process.exit(1);
}

module.exports = client;
