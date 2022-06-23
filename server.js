// --- -- Imports -- ---
// Allgemein
require('dotenv').config();
const { application } = require('express');
const express = require('express')
const PORT = process.env.PORT || 3232;
const axios = require('axios').default
const mongoose = require('mongoose');
const cors = require('cors')

// Password hash

const saltRounds = 10

// Database
const { Schema } = require('mongoose')
const UserDataModel = require('./schemas/user-schemas')
const TwitchDataModel = require('./schemas/twitch-data-schemas')
const ImgDataModel = require('./schemas/img-schemas');
const { resolve } = require('path');

// DB Authorization
const mail = process.env.myMail
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

// Route Imports
const userRoutes = require("./controllerRoutes/userRoutes");
const mediaRoutes = require("./controllerRoutes/mediaRoutes");

// Authentification
const { authenticateToken, createAccessToken } = require("./authServer");
const { env } = require('process');
const { Console, timeStamp } = require('console');

// Routes / API'S
server.post("/", (request, response, next) => {
  response.send('listening...')
})



// 1. DB connection and dataLoad
mongoose.connect(mongoPath, {
  useNewURLParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("DB connection established!")
    console.log("Connecting to userDB ...")
    if (UserDataModel.findOne({ username: "Raikun" }) !== null) {
      console.log("userDB connected!")
    } else {
      console.log("userDB connection failed!")
    }
    //LOGIN: Load userData & streamData
  })
  .catch((err) => {
    console.log("DB connection failed!", err.message, "ERROR END")
  })

// Endpoints
server.use('/user', userRoutes)
server.use('/image', mediaRoutes)

// Webserver
server.listen(PORT, () => {
  console.log(`Webserver: http://localhost:${PORT}`)
})