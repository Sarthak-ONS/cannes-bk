const express = require("express");
const { check, body } = require("express-validator");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: process.env["GOOGLE_AUTH_CLIENT_ID"],
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      done(null, profile);
    }
  )
);

const router = express.Router();

router.use(passport.initialize());

const authController = require("../controllers/auth");

// POST Login Routes
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email").normalizeEmail(),
    body("password", "Invalid Password")
      .trim()
      .isAlphanumeric()
      .isLength({ min: 5, max: 15 }),
  ],
  authController.login
);

// POST Signup Routes
router.post(
  "/signup",
  [
    body("name")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Invalid Name"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password", "Invalid Password")
      .trim()
      .isAlphanumeric()
      .isLength({ min: 5, max: 15 }),
  ],
  authController.signup
);

// POST Forgot Password
router.post("/forgot", authController.forgotPassword);

// POST Password Reset
router.post("/password/reset/:token", authController.passwordReset);

// Google Auth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate(
    "google",

    { failureRedirect: "/login", session: false, successMessage: true }
  ),
  (req, res) => {
    res.send("Success mil gayi");
  }
);

// Google Auth Ends

module.exports = router;
