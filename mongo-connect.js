const mongoose = require("mongoose")
const config = require('./config')

// DB Authorization
const mongoPath = `mongodb+srv://${config.DB_OWNER}:${config.DB_PASSWORD}@cluster0.b3vwvsm.mongodb.net/twitchapp?retryWrites=true&w=majority&appName=twitchApp`

// 1. Mongoose settings
mongoose.set("strictQuery", false);

// 2. DB connection and dataLoad
mongoose.connect(mongoPath, {
    useNewURLParser: true,
    useUnifiedTopology: true,
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