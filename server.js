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
const bcrypt = require('bcrypt')
const saltRounds = 10

// Database
const { Schema } = require('mongoose')
const UserDataModel = require('./schemas/user-schemas')
const TwitchDataModel = require('./schemas/twitch-data-schemas')
const ImgDataModel = require('./schemas/img-schemas');
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

// Twitch
// const tmi = require('tmi.js')

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
const { Console, timeStamp } = require('console');

// Routes / API'S
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
      storage: 400000,
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
    
    const userData = {
      userID: userFromDB._id,
      username: userFromDB.username,
      usergroup: userFromDB.group,
    }
    console.log(userData)

    const generateToken = createAccessToken(userData)

    // Send Data to Frontend
    res.send({isLogedIn:isLogedIn, generateToken:generateToken, userData})
  
    
  } catch(error) {
    console.log("ERROR:", "Error by Login!", error)
  }
})

// IMG Upload
server.post('/imageUpload',  async (req, res) => {
  try {
    //Find: storageSetting in user at DB
    const userFromDB = await UserDataModel.findOne({ userID: req.body.userID })
    const maxStorage = userFromDB.storage
    
    //Find: all images of user in DB
    const userImages = await ImgDataModel.find({ userID: req.body.userID })
    
    // Variable <- Request
    const imgData = await req.body

    // Convert "size" in Bytes to size in KB
    const rawSize = imgData.size/1024
    console.log(typeof rawSize, rawSize)
    const newImgSize = Number(rawSize.toFixed(2))
    console.log(typeof newImgSize, newImgSize)

    // size of all Img in DB from User
    const sum = userImages.reduce((acc, object) => {
      return acc + object.size
    }, 0)
    console.log(typeof sum, sum)

    // Check img in DB  + new img is smaller than max storage
    if(sum + newImgSize < maxStorage){
      const newNumber = Number(sum/1024) + newImgSize
      console.log("newImg", newImgSize, "sum", sum, "newNumber", newNumber)
      console.log(`Upload Yes: ${sum} + ${newImgSize} Belegt: ${newNumber/1024} MB Max ${maxStorage/1024} MB`)
    
    // Upload Data of IMG to DB - Fail
      ImgDataModel(imgData).save() //FEHLER!
      
      // Load imgData from DB
      const imagesFromDB = await ImgDataModel.find({ userID: req.body.userID })
      console.log(imagesFromDB)
      const imgDataFromDB = imagesFromDB.map((image) => {
          
      })

      const imgDataFromDB2 = 

      // Send Data to Frontend
      res.send({maxStorage: sum, ImagesFromDB: imagesFromDB})

    }else{
      const newNumber = Number(sum) + newImgSize
      console.log(`Upload No: ${sum} + ${newImgSize} Belegt: ${newNumber/1024} MB Max ${maxStorage} MB`)
      res.send("Upload Failed!")
    }
    

  } catch(error) {
    console.log("ERROR:", "Error by Img upload!", error)
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


// Twitch
// Geheimnis: 1be0ubi7blb7c7pwrejevj3lx5v8uz
// AccsessToken: gcxdq6488vdwqsoyjj8b1y2vthcsjh
const getTwitchData = async () => {

  viewerSum = 0
  try {
    const twitchData = await axios.get(`https://api.twitch.tv/helix/streams?user_login=Monstercat`, {
      headers: {
        Authorization: `Bearer ${env.TWITCH_AUTH}`,
        'Client-ID': env.TWITCH_CLIENT_ID
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

// Abfrage der Twitchdaten alle 30 Sekunden (120 Anfragen / 1h Livestream)
//setInterval(getTwitchData, 30000)
