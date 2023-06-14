const express = require("express");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: process.env['GOOGLE_AUTH_CLIENT_ID'],
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
// router.use(passport.session());

const authController = require("../controllers/auth");

router.post("/login", authController.login);
router.post("/signup", authController.signup);

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

module.exports = router;
