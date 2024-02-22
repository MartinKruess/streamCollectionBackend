// --- -- Imports -- ---
// Allgemein
const config = require('./config')
require('./mongo-connect')
const express = require('express')
const passport = require('passport')
const cors = require('cors')
// const url = MODE === 'deployment' ? `${config.BASE_URL}:${PORT}` : config.BASE_URL
const { socketServer } = require('./socketserver');


// Route Imports
const userRoutes = require("./controllerRoutes/userRoutes");
const mediaRoutes = require("./controllerRoutes/mediaRoutes");
const dashboardRoutes = require("./controllerRoutes/dashboardRoutes");


// User management Variables
const userGroups = ["user", "duser", "suser"]

// neue Instanzen
const server = express()
server.use(express.json({ limit: "1mb" }))
server.use(cors())

// Sessions
const session = require("express-session")
server.use(session({
  secret: config.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}))
server.use ( passport.initialize())

// Authentification
const { authenticateToken } = require("./authServer");
const { twitchRouter } = require('./twitch/twitchAuth');
// const { getDashboardTwitchData } = require('./controllers/dashboardControllers');

// Endpoints / Routes / API'S
server.get("/", (request, response, next) => {
  response.send('listening...')
})

server.use('/user', userRoutes)
server.use('/media', authenticateToken, mediaRoutes)
server.use('/dashboard', authenticateToken, dashboardRoutes)
server.use('/auth/twitch', twitchRouter)
server.use((err, _req, res, _next) => {
  //!err.status && console.log(err)
  console.log(err)
  res.status(err.status || 500).json({
    error: err.message
  })
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
const httpServer = server.listen(config.PORT, () => {
  console.log(`Webserver: ${config.BASE_URL}:${config.PORT}`)
})

socketServer(httpServer)
