const mongoose = require('mongoose')

const imgString = {
    type: String,
    required: true
}

const imgSchema = mongoose.Schema({
    userID: imgString,
    view: imgString,
    name: String,
    size: {
        type: Number,
        required: true
    },
    type: String,
}, {collection: 'imgDB'})

const ImgDataModel = mongoose.model('imgDB', imgSchema)
module.exports =  ImgDataModel