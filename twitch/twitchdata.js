const config = require('../config')
const UserDataModel = require("../schemas/user-schemas")

const getTwitchUserData = async () => {

    const user = UserDataModel.findOne({mail: "martinkr90@googlemail.com"})
    console.log(config.TWITCH_CLIENT_ID)
    try {
      const twitchData = await axios.get(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
        headers: {
          Authorization: `Bearer ${env.APP_ACCESS_TOKEN}`,
          twitchId: user.twitchId,
          twitchToken: user.twitchToken,
          'Client-ID': config.TWITCH_CLIENT_ID
        }
      })
      console.log(twitchData)
    }
    catch(err){

    }
}