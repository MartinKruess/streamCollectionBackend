const mongoose = require('mongoose')

const mediaString = {
    type: String,
    required: true
}

const mediaNumber = {
    type: Number,
    required: true
}

const mediaSchema = mongoose.Schema({
    userID: mongoose.Types.ObjectId,
    name: mediaString,
    url: mediaString,
    size: mediaNumber,
    vol: mediaNumber,
    format: mediaString,
    quality: mediaNumber,
    frames: mediaNumber,
    type: mediaString,
}, {collection: 'soundDB'})

const MediaDataModel = mongoose.model('mediaDB', mediaSchema)
module.exports =  MediaDataModel