const mongoose = require('mongoose')

const reqNumber = {
    type: Number,
    required: true
}

const nameString = {
    type: String,
}

const amountNumber = {
    type: Number,
}

const twitchDataSchema = mongoose.Schema(
{
    userID: {
        type: String,
        required: true
    },
    twitchUserID: reqNumber,
    follows: amountNumber,
    lastFollowers: [
        {
            followName: nameString,
        }
    ],
    cheers: amountNumber,
    lastCheers:  [
        {
            followName: nameString,
            amount: amountNumber
        }
    ],
    donations: amountNumber,
    lastDonations: [
        {
            followName: nameString,
            amount: amountNumber
        }
    ],
    subs: amountNumber,
    lastSubs:  [
        {
            followName: nameString,
        }
    ],
    viewerAvg: amountNumber,
}, {collection: 'twitchData'})
const TwitchDataModel =  mongoose.model('twitchData', twitchDataSchema);
module.exports = TwitchDataModel;