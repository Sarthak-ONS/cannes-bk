const express = require("express");
const { check, body } = require("express-validator");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookie = require("cookie");

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
    console.log(
      req.user,
      "///////////// This is the prfile we get after success"
    );
    // Set the token as a cookie in the response
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "This is a dummy token", {
        httpOnly: true, // Ensures the cookie is only accessible via HTTP(S)
        secure: process.env.NODE_ENV === "production", // Requires HTTPS in production environment
        sameSite: "strict", // Restricts the cookie to be sent only on same-site requests
        path: "/", // Specifies the root path where the cookie is valid
        expires: new Date(Date.now() + 3600000), // Sets the expiration time of the cookie (1 hour in this example)
      })
    );
    return res.redirect(`${process.env.FRONTEND_SERVER_URL}/`);
  }
);

// Google Auth Ends

module.exports = router;
