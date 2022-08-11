const mongoose = require("mongoose")
const config = require('./config')

// DB Authorization
const mongoPath = `mongodb+srv://${config.DB_OWNER}:${config.DB_PASSWORD}@twitchapp.zg8ms.mongodb.net/twitchappdb?retryWrites=true&w=majority`

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