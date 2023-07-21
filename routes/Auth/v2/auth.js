const router = require("express").Router();
const otpController = require("../../../controllers/v2/auth");

router.post("/otp/send", otpController.requestOTP);

router.post("/otp/verify", otpController.verifyOTP);

module.exports = router;
