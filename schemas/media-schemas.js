const mongoose = require('mongoose')

const mediaString = {
    type: String,
    required: true
}

const mediaNumber = {
    type: Number,
}

const mediaSchema = mongoose.Schema({
    userID: mediaString,
    title: mediaString,
    volume: mediaNumber,
    size: mediaNumber,
    type: mediaString,
}, {collection: 'media'})

const UserDataModel = mongoose.model('usersDB', userSchema)
module.exports =  UserDataModel