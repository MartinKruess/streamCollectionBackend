const { getTwitchData } = require('../twitch/twitchDataLink');

exports.getDashboardTwitchData = async (req, res, next) => {

    const dataLinkBits = "https://api.twitch.tv/helix/bits/leaderboard"
    const dataLinkSubs = "https://api.twitch.tv/helix/subscriptions"
    const dataLinkBan = "https://api.twitch.tv/helix/moderation/banned"
    const dataLinkGoals = "https://api.twitch.tv/helix/goals"
    const dataLinkFollows = "https://api.twitch.tv/helix/users/follows"
    const dataLinkHypeTrain = "https://api.twitch.tv/helix/hypetrain/events"
    const dataLinkMods = "https://api.twitch.tv/helix/moderation/moderators"
    const dataLinkEmotes = "https://api.twitch.tv/helix/chat/emotes"

    const twitchDataObj = {
      bitList: [],
      bitList: [],
      subList: [],
      banList: [],
      subs: [],
      follows: [],
      hypeTrain: [],
      moderators: [],
      emotes: [],
    }

    try{
        twitchDataObj.bitList = await getTwitchData(dataLinkBits)
        twitchDataObj.subList = await getTwitchData(dataLinkSubs, "broadcaster_id")
        twitchDataObj.banList = await getTwitchData(dataLinkBan, "broadcaster_id")
        twitchDataObj.subs = await getTwitchData(dataLinkGoals, "broadcaster_id")
        twitchDataObj.follows = await getTwitchData(dataLinkFollows, "to_id")
        twitchDataObj.hypeTrain = await getTwitchData(dataLinkHypeTrain, "broadcaster_id")
        twitchDataObj.moderators = await getTwitchData(dataLinkMods, "broadcaster_id")
        twitchDataObj.emotes = await getTwitchData(dataLinkEmotes, "broadcaster_id")
        
        res.send(twitchDataObj)
    }
    catch(err){
      next(err.response && err.response.data)
    }
}

// exports.banUser = async (req, res) => {
//   const banLink = "https://api.twitch.tv/helix/moderation/bans"
//   const sendBan = async ( banLink) => {

//     const user = await UserDataModel.findOne({mail: "martinkr90@googlemail.com"})

//       try {
//         const twitchData = await axios.post(`${banLink}?broadcaster_id=${user.twitchId}`, {
//           headers: {
//             Authorization: `Bearer ${user.twitchToken}`,
//             'Client-ID': env.TWITCH_CLIENT_ID,
//             'Content-Type': 'application/json',
//             'data': '{"user_id":"9876","duration":300,"reason":"no reason"}}'
//           },
//           body:  [
//             {
//               "broadcaster_id": user.twitchId,
//               "moderator_id": "5678",
//               "user_id": "9876",
//               "created_at": "2021-09-28T19:27:31Z",
//               "end_time": "2021-09-28T19:22:31Z"
//             }
//           ]        
//         })
//         return twitchData.data.data
//       }
//       catch(err){
//         console.log(err.response.data)
//       }
//   }
// }