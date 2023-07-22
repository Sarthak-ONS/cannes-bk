const client = require("../../services/twilio.service");
const OTP = require("../../models/otp");
const { v4: uuidv4 } = require("uuid");

const otpExpiry = parseInt(process.env.OTP_EXPIRY || 300);

exports.requestOTP = async (req, res, next) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}, Kindly ignore, if you have not requested`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+91" + phoneNumber,
      validityPeriod: otpExpiry,
    });

    const uid = uuidv4();
    const expiresAt = new Date(Date.now() + otpExpiry * 1000);
    await OTP.create({
      phoneNumber,
      otp,
      expiresAt: expiresAt,
      sessionId: uid,
    });

    res.json({
      message: "OTP sent successfully!",
      messageId: message.sid,
      verificationId: uid,
    });
  } catch (error) {
    console.log(error);
    const err = new Error("Failed to send OTP!");
    err.httpStatusCode = 500;
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { otp, verificationId, phoneNumber } = req.body;
  try {
    const otpSession = await OTP.findOne({
      phoneNumber,
      sessionId: verificationId,
    });

    if (!otpSession) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please send OTP first." });
    }
    if (otpSession.expiresAt < Date.now()) {
      await OTP.findOneAndDelete({ phoneNumber, sessionId: verificationId });
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new OTP." });
    }
    if (otp !== otpSession.otp) {
      return res.status(400).json({ message: "Invalid OTP code!" });
    }
    await OTP.findOneAndDelete({ phoneNumber, sessionId: verificationId });
    res.json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.log(error);
    const err = new Error("Failed to verify OTP!");
    err.httpStatusCode = 500;
    next(err);
  }
};
