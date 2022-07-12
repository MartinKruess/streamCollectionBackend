// --- -- Imports -- ---
// Allgemein
require('dotenv').config();
const { application } = require('express');
const express = require('express')
const passport = require('passport')
const BASE_URL = process.env.BASE_URL
const MODE = process.env.MODE
const PORT = process.env.PORT || 3232;
const mongoose = require('mongoose');
const cors = require('cors')
const url = MODE === 'deployment' ? `${BASE_URL}:${PORT}` : BASE_URL

// Route Imports
const userRoutes = require("./controllerRoutes/userRoutes");
const mediaRoutes = require("./controllerRoutes/mediaRoutes");
const dashboardRoutes = require("./controllerRoutes/dashboardRoutes");


// Database
const UserDataModel = require('./schemas/user-schemas')

// DB Authorization
const dbOwner = process.env.dbOwner
const dbPassword = process.env.dbPassword
const mongoPath = `mongodb+srv://${dbOwner}:${dbPassword}@twitchapp.zg8ms.mongodb.net/twitchappdb?retryWrites=true&w=majority`

// User management Variables
const userGroups = ["user", "duser", "suser"]

// neue Instanzen
const server = express()
server.use(express.json({ limit: "1mb" }))
server.use(cors())
console.log('Cors is active')


// Sessions
const session = require("express-session")
server.use(session({
  secret: "hahohe",
  saveUninitialized: false,
  resave: false
}))
server.use ( passport.initialize())


// Authentification
const { authenticateToken, createAccessToken } = require("./authServer");
const { env } = require('process');
const { Console, timeStamp } = require('console');
const twitchRouter = require('./twitch/twitchAuth');
const { getDashboardTwitchData } = require('./controllers/dashboardControllers');

// Endpoints / Routes / API'S
server.get("/", (request, response, next) => {
  response.send('listening...')
})

server.use('/user', userRoutes)
server.use('/media', authenticateToken, mediaRoutes)
server.use('/dashboard', authenticateToken, dashboardRoutes)
server.use('/auth/twitch', twitchRouter)
server.use((err, req, res, next) => {
  //!err.status && console.log(err)
  console.log(err)
  res.status(err.status || 500).json({
    error: err.message
  })
})

// 1. DB connection and dataLoad
mongoose.connect(mongoPath, {
  useNewURLParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("DB connection established!")
    console.log("Connecting to userDB ...")
    console.log("userDB connected!")
    
    //LOGIN: Load userData & streamData
  })
  .catch((err) => {
    console.log("DB connection failed!", err.message, "ERROR END")
  })


// Twitch

//DASHBOARD GET
  // mods online: GET https://api.twitch.tv/helix/moderation/moderators
  // Umfragen: GET https://api.twitch.tv/helix/polls
  // Kathegorien suchen: GET https://api.twitch.tv/helix/search/categories 
  // your Teams: GET https://api.twitch.tv/helix/teams/channel
  // TeamData: GET https://api.twitch.tv/helix/teams

// DASHBOARD POST
  // User bannen: POST https://api.twitch.tv/helix/moderation/bans
  // User entbannen: DELETE https://api.twitch.tv/helix/moderation/bans
  // POST https://api.twitch.tv/helix/extensions/chat

//CHATBOT
  // AutoMod: POST https://api.twitch.tv/helix/moderation/enforcements/status msg_id msg_text is_permitted= false (blocked)
  // Manage autoMod: POST https://api.twitch.tv/helix/moderation/automod/message
  // Read AutoModSettings: GET https://api.twitch.tv/helix/moderation/automod/settings
  // Upgrade AutoModSettings: PUT https://api.twitch.tv/helix/moderation/automod/settings
  
  // blocked Words: GET https://api.twitch.tv/helix/moderation/blocked_terms
  // Add blocked words: POST https://api.twitch.tv/helix/moderation/blocked_terms
  // delete blocked words: DELETE https://api.twitch.tv/helix/moderation/blocked_terms
  
//BOSSFIGHT
  // Cheer Emotes prefix: https://api.twitch.tv/helix/bits/cheermotes

// Webserver
server.listen(PORT, () => {
  console.log(`Webserver: ${BASE_URL}:${PORT}`)
})