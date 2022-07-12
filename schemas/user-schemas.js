const mongoose = require('mongoose')

const regString = {
    type: String,
    required: true
}

const regNumber = {
    type: Number,
}

const userSchema = mongoose.Schema({
    mail: regString,
    username: regString,
    password: regString,
    group: {
        type: String
    },
    twitchId: {
        type: String
    },
    twitchToken: {
        type: String
    },
    twitchRefreshToken: {
        type: String
    },
    movies: regNumber,
    music: regNumber,
    images: regNumber,
    storage: regNumber,
}, {collection: 'usersDB'})

const UserDataModel = mongoose.model('usersDB', userSchema)
module.exports =  UserDataModel