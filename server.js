// Imports
require('dotenv').config();
const { application } = require('express');
const express = require('express')
const PORT = process.env.PORT || 3232;
const axios = require('axios').default
const mongoose = require('mongoose');
const cors = require('cors')

// Password hash
const bcrypt = require('bcrypt')
const saltRounds = 10

// Database
const { Schema } = require('mongoose')
const UserDataModel = require('./schemas/user-schemas')
const TwitchDataModel = require('./schemas/twitch-data-schemas')
const LoginController = require('./comps/login/login');
const { resolve } = require('path');

// Paypal
// const paypal = require('./paypal.js')
// const { createOrder, capturePayment } = require('./paypal')

// DB Authorization
const mail = process.env.myMail
const dbOwner = process.env.dbOwner
const dbPassword = process.env.dbPassword
const mongoPath = `mongodb+srv://${dbOwner}:${dbPassword}@twitchapp.zg8ms.mongodb.net/twitchappdb?retryWrites=true&w=majority`

// User management Variables
const userGroups = ["user", "duser", "suser"]

// Variables for TwitchData
let viewCounters = []
let viewerSum = 0
let viewerAverage = 0
const lastAverage = []

// neue Instanzen
const server = express()
server.use(express.json({ limit: "1mb" }))
server.use(cors())

// Authentification
const {authenticateToken, createAccessToken} = require("./authServer");
const { env } = require('process');

// Routes
server.post("/", (request, response, next) => {
  response.send('listening...')
  response.send
})

// REGISTER API
server.post('/register', async (req, res) => {
  try {
    let dataOfUser = {}
    const hashedRegisterPassword = await bcrypt.hash(req.body.password, saltRounds)
    console.log("HashedPW ", hashedRegisterPassword)

    dataOfUser = {
      mail: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: hashedRegisterPassword,
      group: userGroups[0],
      movies: 0,
      music: 0,
      images: 0,
      storage: 400,
    },
      console.log("Data of User, DB get ->", dataOfUser)

    //SAVE: userData to userDB
    UserDataModel(dataOfUser).save()
    res.send('Successfull registrated!')

  } catch (error) {
    console.log("ERROR:", error, "Error by registration!")
  }
})


// LOGIN API
server.post('/login',  async (req, res) => {
  //Find: userData in userDB
  const userFromDB = await UserDataModel.findOne({ username: req.body.username })
  try {
    // COMPARE: loginData === userData
    const isLogedIn = await bcrypt.compare(req.body.password, userFromDB.password)
    //if (isLoginIn === false) return
    console.log("HashedPW ", isLogedIn)
    
    const generateToken = createAccessToken(userFromDB)

    // Send Data to Frontend
    res.send({isLogedIn:isLogedIn, generateToken:generateToken})
  
  } catch {
    console.log("ERROR:", "Error by registration!")
  }
})

// Webserver
server.listen(PORT, () => {
  console.log(`Webserver: http://localhost:${PORT}`)
})

// 1. DB connection and dataLoad 
mongoose.connect(mongoPath, {
  useNewURLParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("DB connection established!")
    console.log("Connecting to userDB ...")
    if (UserDataModel.findOne({ userID: "test" }) !== null) {
      console.log("userDB connected!")
    } else {
      console.log("userDB connection failed!")
    }
    //LOGIN: Load userData & streamData
  })
  .catch((err) => {
    console.log("DB connection failed!", err.message, "ERROR END")
  })

// Twitch
// Geheimnis: 1be0ubi7blb7c7pwrejevj3lx5v8uz
// AccsessToken: gcxdq6488vdwqsoyjj8b1y2vthcsjh
const getTwitchData = async () => {

  viewerSum = 0
  try {
    const twitchData = await axios.get(`https://api.twitch.tv/helix/streams?user_login=Monstercat`, {
      headers: {
        Authorization: `Bearer ${env.twitchAuth}`,
        'Client-ID': env.twitchClientID
      }
    })

    const dataOfTwitch = {
      userID: 123, //Required!!!
      twitchUserID: twitchData.data.data[0].user_id,
      viewerAverage: viewerAverage.toFixed(2),
      lastAverage: lastAverage
    }

    console.log("Data of Twitch", dataOfTwitch)


    // SAVE: Data to twitchData
    // await TwitchDataModel(dataOfTwitch).save() PAUSE

    // Login control
    // LoginController

    
    //console.log(twitchData.data.data[0].user_id)

    if (twitchData.data.data[0].type === "live") {

      viewCounters.push(twitchData.data.data[0].viewer_count)
      viewCounters.forEach(viewCount => {
        viewerSum += viewCount
      })
      viewerAverage = viewerSum / viewCounters.length
      console.log("viewerSum", viewerSum)
console.log("viewerAverage", viewerAverage)
      return viewerAverage.toFixed(2)
    }else{
      lastAverage.push(viewerAverage)
    }
  } catch (err) {
    console.error(err);
  }
  
}

setInterval(getTwitchData, 3000)


console.log("------------ REGISTER ------------")


//REGISTER: fetch streamData

//UPDATE: streamData by Fetch

// Group management
// PAYPAL: Account: martinkr90@googlemail.com
// PAYPAL-ClientID: AWGUgXWGV3vwwSxZocyqaLtDNtbRurKv2NOc0F19Rn8gFZ6gcw3LA2A2D8iye4iiFfs-8EosfFy0tye9
// PAYPAL-SECRET: 
// server.post("/api/orders", async (req, res) => {
//   const order = await paypal.createOrder();
//   res.json(order);
// });

// server.post("/api/orders/:orderId/capture", async (req, res) => {
//   const { orderId } = req.params;
//   const captureData = await paypal.capturePayment(orderId);
//   res.json(captureData);
// });

const kindOfUser = "monatlich"
const hardCodedUser = "monatlich"

// Wenn response = monatlich -> setzte userGroup auf subscriber (monatlich) sonst setze auf donator (einmalig)
/*res.json(captureData)*/ // hardCodedUser === kindOfUser ? userFromDB.group = userGroups[2] : userFromDB.group = userGroups[1]

// DB groupe Change
// request
// Auth / isAdmin?
// response / absage
