const express = require('express')
const passport = require('passport')
const config = require('../config')

const twitchStrategy = require("passport-twitch-new").Strategy;
const { Router } = require('express');
const { profile } = require('console');
const UserDataModel = require('../schemas/user-schemas');
const { default: axios } = require('axios');
const twitchRouter = Router()

// Validation
console.log("Start Vaidation ...")
passport.use(new twitchStrategy({
    clientID: config.TWITCH_CLIENT_ID,
    clientSecret: config.TWITCH_CLIENT_SECRET,
    callbackURL: config.TWITCH_OAUTH_REDIRECT,
    scope: [
      "user_read", "bits:read", "channel:read:hype_train", "moderation:read",
      "moderator:manage:automod", "moderator:read:automod_settings",
      "moderator:manage:automod_settings", "moderator:manage:banned_users",
      "moderator:read:blocked_terms", "moderator:manage:blocked_terms",
      "channel:read:polls", "channel:read:subscriptions", "channel:read:goals",
    ]
    //
  },

  async function(accessToken, refreshToken, profile, done) {
    console.log("29, PROFILE", profile)
    await UserDataModel.updateOne({ mail: profile.email },{"twitchId": profile.id, "twitchToken": accessToken, "twitchRefreshToken": refreshToken})
    const userUpdated = await UserDataModel.findOne({ mail: profile.email })
    done(null, userUpdated)
  }
));

passport.serializeUser(function(user, done) {
  console.log("Serialize User", user)
    done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("Deserialize User", user)
    done(null, user);
});

// Frontend -> Twitch
twitchRouter.get("/", passport.authenticate("twitch", { 
  session: false,
  forceVerify: true
}))

twitchRouter.get("/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    console.log("54, Twitch Redirect", req.user)
    res.redirect(`${config.PROD_URL}/dashboard`);
});

const refToken = async (user) => {
  try{
    const res = await axios.post(`https://id.twitch.tv/oauth2/token`,{
        grant_type: "refresh_token",
        refresh_token: user.twitchRefreshToken,
        client_id: config.TWITCH_CLIENT_ID,
        client_secret: config.TWITCH_CLIENT_SECRET,
      })
      await UserDataModel.updateOne({ mail: user.mail },{"twitchToken": res.data.access_token, "twitchRefreshToken": res.data.refresh_token})
      console.log("67, Twitch Token?", res.data.access_token)
  }
  catch(err){
    console.log(err.response.data)
  }
}

module.exports = { twitchRouter,  refToken}