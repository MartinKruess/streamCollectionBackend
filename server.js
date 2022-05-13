// Imports
require('dotenv').config();
const { application } = require('express');
const express = require('express')
const PORT = 3232;
const axios = require('axios').default
const mongoose = require('mongoose');
const { Schema } = require("mongoose")
const UserDataModel = require('./schemas/user-schemas') 
const TwitchDataModel = require('./schemas/twitch-data-schemas')
const loadUserData = require('./comps/login/loadUserData')
//const register = require('./comps/register/register')
const LoginController = require('./comps/login/login')

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

// Routes
server.get("/", (request, response, next) => {
  response.send('listening...')
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
    if(UserDataModel.findOne({ userID: "test" }) !== null){
      console.log("userDB connected!")
    }else{
      console.log("userDB connection failed!")
    }
    //LOGIN: Load userData & streamData
    loadUserData
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

    const dataOfUser = {
      mail: "testmail@mail.com",
      username: "testuser",
      password: "test123",
      group: "user",
    }

    //SAVE: userData to userDB
    // await UserDataModel(dataOfUser).save()

    // LOAD TwitchData by mail
    const userFromDB = await UserDataModel.findOne({ mail: "testmail@mail.com" })
    // console.log("userFromDB:", userFromDB._id)
    // console.log("userID Raw:", userFromDB._id.id)
    // const userID = userFromDB._id.id.join("")
    // console.log("userID joined:", userID)

  
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


//REGISTER: fetch streamData



//UPDATE: streamData by Fetch

