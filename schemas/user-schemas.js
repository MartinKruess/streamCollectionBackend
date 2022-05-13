const mongoose = require('mongoose')

const regString = {
    type: String,
    required: true
}

const userSchema = mongoose.Schema({
    mail: regString,
    username: regString,
    password: regString,
    group: {
        type: String
    },
}, {collection: 'usersDB'})

const UserDataModel = mongoose.model('usersDB', userSchema)
module.exports =  UserDataModel