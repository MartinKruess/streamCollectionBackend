// --- -- Imports -- ---
// Allgemein
require('dotenv').config();
const { application } = require('express');
const express = require('express')
const PORT = process.env.PORT || 3232;
const axios = require('axios').default
const mongoose = require('mongoose');
const cors = require('cors')
const passport = require('passport')
const twitchStrategy = require("passport-twitch").Strategy;

// Password hash
const bcrypt = require('bcrypt')
const saltRounds = 10

// Database
const { Schema } = require('mongoose')
const UserDataModel = require('./schemas/user-schemas')
const ImgDataModel = require('./schemas/img-schemas');
const TwitchDataModel = require('./schemas/twitch-data-schemas')
const { resolve } = require('path');

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
      console.log("LogedIn: ->", dataOfUser.userID)

    //SAVE: userData to userDB
    UserDataModel(dataOfUser).save()
    res.send('Successfull registrated!')

  } catch (error) {
    console.log("ERROR:", error, "Error by registration!")
  }
})

// LOGIN API
server.post('/login', async (req, res) => {
  //Find: userData in userDB
  const userFromDB = await UserDataModel.findOne({ username: req.body.username })
  try {
    // COMPARE: loginData === userData
    const isLogedIn = await bcrypt.compare(req.body.password, userFromDB.password)
    //if (isLoginIn === false) return
    
    const userData = {
      userID: userFromDB._id,
      username: userFromDB.username,
      usergroup: userFromDB.group,
    }

    const generateToken = createAccessToken(userData)

    // Send Data to Frontend
    res.send({isLogedIn:isLogedIn, generateToken:generateToken, userData})
  
    
  } catch(error) {
    console.log("ERROR:", "Error by Login!", error)
  }
})

// UMGEBASTELT
const loadImgFromDB = async () => {
 
}

const uploadImgToDB = async (imgData) => {
  
  return sum
}
// UMGEBASTELT

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
    const newImgSize = Number(rawSize.toFixed(2))

    // size of all Img in DB from User
    const sum = userImages.reduce((acc, object) => {
      return acc + object.size
    }, 0)

    // Check img in DB  + new img is smaller than max storage
    if(sum + newImgSize < maxStorage){
      const newNumber = Number(sum/1024) + newImgSize

    // Upload Data of IMG to DB - Fail
      ImgDataModel(imgData).save()
    }else{
      const newNumber = Number(sum) + newImgSize
      res.send("Upload Failed!")
    }
    // Load imgData from DB
    const imagesFromDB = await ImgDataModel.find({ userID: req.body.userID })

    // if (imgData.size){
    //   const sum = await uploadImgToDB(imgData)
    //   const imagesFromDB = await loadImgFromDB()
    //   res.send({maxStorage: sum, ImagesFromDB: imagesFromDB})

    // }else{
    //   const imagesFromDB = await loadImgFromDB()
    //   res.send({maxStorage: sum, ImagesFromDB: imagesFromDB})
    // }
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


// Abfrage der Twitchdaten alle 30 Sekunden (120 Anfragen / 1h Livestream)
// setInterval(getTwitchData, 30000)


// TWITCH X-Auth TEST

// Validation
passport.use("twitch", twitchStrategy)

passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: `http://127.0.0.1:${PORT}/auth/twitch/callback`,
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ twitchId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

server.get("/", (req, res) => {
    res.render("index");
});

// Frontend -> Twitch
server.get("/auth/twitch", passport.authenticate("twitch"))

server.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000/dashboard");
});