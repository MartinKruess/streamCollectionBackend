const { default: axios } = require('axios');
const config = require('../config')
const { env } = require('process');
const UserDataModel = require('../schemas/user-schemas');
const { refToken } = require('../twitch/twitchAuth');
const { getTwitchData } = require('../twitch/twitchDataLink');

exports.getDashboardTwitchData = async (req, res, next) => {

  const twitchDataObj = {
    userList: [],
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

  const getFetchCollection = async () => {
    const dataLinkBits = "https://api.twitch.tv/helix/bits/leaderboard"
    const dataLinkSubs = "https://api.twitch.tv/helix/subscriptions"
    const dataLinkBan = "https://api.twitch.tv/helix/moderation/banned"
    const dataLinkGoals = "https://api.twitch.tv/helix/goals"
    const dataLinkFollows = "https://api.twitch.tv/helix/users/follows"
    const dataLinkHypeTrain = "https://api.twitch.tv/helix/hypetrain/events"
    const dataLinkMods = "https://api.twitch.tv/helix/moderation/moderators"
    const dataLinkEmotes = "https://api.twitch.tv/helix/chat/emotes"
    const dataLinkUsers = "https://api.twitch.tv/helix/users"

    twitchDataObj.userList = await getTwitchData(dataLinkUsers)
    twitchDataObj.bitList = await getTwitchData(dataLinkBits)
    twitchDataObj.subList = await getTwitchData(dataLinkSubs, "broadcaster_id")
    twitchDataObj.banList = await getTwitchData(dataLinkBan, "broadcaster_id")
    twitchDataObj.subs = await getTwitchData(dataLinkGoals, "broadcaster_id")
    twitchDataObj.follows = await getTwitchData(dataLinkFollows, "to_id")
    twitchDataObj.hypeTrain = await getTwitchData(dataLinkHypeTrain, "broadcaster_id")
    twitchDataObj.moderators = await getTwitchData(dataLinkMods, "broadcaster_id")
    twitchDataObj.emotes = await getTwitchData(dataLinkEmotes, "broadcaster_id")

    return twitchDataObj
  }

  try {
    const response = await getFetchCollection()
    await res.send(response)
  }
  catch (err) {
    if (err.response.data.status === 401 && req.user.twitchRefreshToken) {
      await refToken(req.user)
      const response = await getFetchCollection()
      await res.send(response)
    }
  }
}

exports.banTwitchUser = async (req, res) => {
  const userToBan = req.body
  const viewerList = [{ id: "123", username: "Matze" }, { id: "124", username: "Nico" }]
  const banUser = viewerList.find(viewer => viewer.username === userToBan.username)
  console.log("User aus ViewerList", banUser)
  const banLink = "https://api.twitch.tv/helix/moderation/bans"

  console.log(req.user, req.body)
  const user = await UserDataModel.findOne({ mail: req.user.mail })
  try {
    const twitchData = await axios.post(`${banLink}?broadcaster_id=${user.twitchId}&moderator_id=${user.twitchId}`,
      {
        'data': {"user_id":"9876","duration":300,"reason": userToBan.reason }
      },
      {
        headers: {
          Authorization: `Bearer ${user.twitchToken}`,
          'Client-ID': config.TWITCH_CLIENT_ID,
        },
      })
    return twitchData.data.data
  }
  catch (err) {
    console.log(err.response.data)
  }
}