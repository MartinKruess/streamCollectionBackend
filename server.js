// Imports
require('dotenv').config();
const { application } = require('express');
const express = require('express')
const PORT = 3232;
const axios = require('axios').default
const mongoose = require('mongoose');
const cors = require('cors')

const bcrypt = require('bcrypt')
const saltRounds = 10

const { Schema } = require("mongoose")
const UserDataModel = require('./schemas/user-schemas')
const TwitchDataModel = require('./schemas/twitch-data-schemas')
const LoginController = require('./comps/login/login');
const { resolve } = require('path');

// DB Authorization
const mail = process.env.myMail
const dbOwner = process.env.dbOwner
const dbPassword = process.env.dbPassword
const mongoPath = `mongodb+srv://${dbOwner}:${dbPassword}@twitchapp.zg8ms.mongodb.net/twitchappdb?retryWrites=true&w=majority`

// Variables for Data
let viewCounters = []
let viewerSum = 0
let viewerAverage = 0

// neue Instanzen
const server = express()
server.use(express.json({ limit: "1mb" }))
server.use(cors())

// Routes
server.post("/", (request, response, next) => {
  response.send('listening...')
})

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
      group: "user"
    },
      console.log("Data of User, DB get ->", dataOfUser)

    //SAVE: userData to userDB
    UserDataModel(dataOfUser).save()
    res.send('Successfull registrated!')


  } catch (error) {
    console.log("ERROR:", error, "Error by registration!")
  }
})

// USERNAME: Martin
// PASSWORD: LoginPW123!
server.post('/login', async (req, res) => {
  //Find: userData in userDB
  const userFromDB = await UserDataModel.findOne({ username: req.body.username })
  try {
    // COMPARE: loginData === userData
    const isLogedIn = await bcrypt.compare(req.body.password, userFromDB.password)
    console.log("HashedPW ", isLogedIn)
    resolve(res)
    res.send(isLogedIn)

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
        Authorization: 'Bearer gcxdq6488vdwqsoyjj8b1y2vthcsjh',
        'Client-ID': 'ldhmjq6ih4k1e7uto56fi9nnzga7ua'
      }
    })

    const dataOfTwitch = {
      userID: 123, //Required!!!
      twitchUserID: twitchData.data.data[0].user_id,
    }

    // SAVE: Data to twitchData
    // await TwitchDataModel(dataOfTwitch).save() PAUSE

    // Login controll
    LoginController

    //console.log("Viewer", twitchData);
    //console.log(twitchData.data.data[0].user_id)

    if (twitchData.data.data[0].type === "live") {

      viewCounters.push(twitchData.data.data[0].viewer_count)
      viewCounters.forEach(viewCount => {
        viewerSum += viewCount
      });
      viewerAverage = viewerSum / viewCounters.length
      return viewerAverage.toFixed(2)
    }
  } catch (err) {
    console.error(err);
  }
}

getTwitchData()
//setInterval(getTwitchData, 6000)


//REGISTER: create userData
console.log("------------ REGISTER ------------")
//register

//REGISTER: fetch streamData


//UPDATE: streamData by Fetch
