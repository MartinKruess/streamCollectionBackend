require('dotenv').config();
const passport = require('passport')
//const twitchStrategy = require("passport-twitch").Strategy;
var twitchStrategy = require("@d-fischer/passport-twitch").Strategy;
const { Router } = require('express');
const { profile } = require('console');
const UserDataModel = require('../schemas/user-schemas');

const twitchRouter = Router()


// Validation
passport.use("twitch", twitchStrategy)

passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: "http://localhost:3232/auth/twitch/callback",
    session: false,
    scope: "user_read"
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log("test")
    console.log("Profile from Console", profile)
    console.log(accessToken)
      
    const user = await UserDataModel.findOne({ mail: profile.email })
    console.log("USER", user)
    user.twitchId = profile.id
    user.twitchToken = accessToken
    user.save(function (err, userUpdated) {       
        return done(err, userUpdated);
    })
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Frontend -> Twitch
twitchRouter.get("/", passport.authenticate("twitch", { forceVerify: true }))

twitchRouter.get("/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    console.log("authenticated!")
    res.redirect("http://localhost:3000/dashboard");
});

module.exports = twitchRouter