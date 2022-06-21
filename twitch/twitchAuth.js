require('dotenv').config();
const passport = require('passport')
const twitchStrategy = require("passport-twitch").Strategy;

// Validation
passport.use("twitch", twitchStrategy)

passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitch/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ twitchId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/", function (req, res) {
    res.render("index");
});

// Frontend -> Twitch
app.get("/auth/twitch", passport.authenticate("twitch"))

app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000/dashboard");
});