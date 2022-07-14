const express = require('express')

const passport = require('passport')
require('dotenv').config();

//const twitchStrategy = require("passport-twitch").Strategy;
//const twitchStrategy = require("@d-fischer/passport-twitch").Strategy;
const twitchStrategy = require("passport-twitch-new").Strategy;
const { Router } = require('express');
const { profile } = require('console');
const UserDataModel = require('../schemas/user-schemas');
const { default: axios } = require('axios');
const twitchRouter = Router()
const { env } = require('process');

// Validation

passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: process.env.TWITCH_OAUTH_REDIRECT,
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
      
    await UserDataModel.updateOne({ mail: profile.email },{"twitchId": profile.id, "twitchToken": accessToken, "twitchRefreshToken": refreshToken})
    const userUpdated = await UserDataModel.findOne({ mail: profile.email })
    console.log(userUpdated)
    done(null, userUpdated)
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Frontend -> Twitch
twitchRouter.get("/", passport.authenticate("twitch", { 
  session: false,
  forceVerify: true
}))

twitchRouter.get("/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    console.log("authenticated!")
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

exports.refToken = async (refreshToken) => {
  const oAuthUser = await UserDataModel.findOne({ mail: profile.email })

  const newTokens = await axios.post(`https://id.twitch.tv/oauth2/token?broadcaster-id=${oAuthUser.twitchId}`,{
  headers: {'Content-Type': 'application/json'},
  body: {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    }
  })
}



module.exports = twitchRouter