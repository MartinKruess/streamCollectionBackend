const mongoose = require('mongoose')

const imgString = {
    type: String,
    required: true
}

const imgSchema = mongoose.Schema({
    userID: mongoose.Types.ObjectId,
    view: imgString,
    name: imgString,
    size: {
        type: Number,
        required: true
    },
    type: imgString,
}, {collection: 'imgDB'})

const ImgDataModel = mongoose.model('imgDB', imgSchema)
module.exports =  ImgDataModel