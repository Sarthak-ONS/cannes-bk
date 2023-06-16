const express = require("express");
const { check, body } = require("express-validator");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_AUTH_CLIENT_ID"],
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ email: profile._json.email });
      if (!user) {
        await User.create({
          name: `${profile.displayName}`,
          email: profile._json.email,
          isVerified: true,
          provider: "google",
        });
      }

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

router.get("/verify/:token", authController.verifyEmail);

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
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_SERVER_URL}/auth/login`,
    session: false,
    successMessage: true,
  }),
  (req, res) => {
    console.log(req.user, "///////////// This is the prfile we get after success");
    return res.redirect(`${process.env.FRONTEND_SERVER_URL}/`);
  }
);

// Google Auth Ends

module.exports = router;
