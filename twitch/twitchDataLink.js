const { default: axios } = require("axios")
const config = require('../config')
const UserDataModel = require("../schemas/user-schemas")

// reusable function to get data from twitch
exports.getTwitchData = async ( dataLink , id="id") => {
  const user = await UserDataModel.findOne({mail: "martinkr90@googlemail.com"})

      const twitchData = await axios.get(`${dataLink}?${id}=${user.twitchId}`, {
        headers: {
          Authorization: `Bearer ${user.twitchToken}`,
          'Client-ID': config.TWITCH_CLIENT_ID,
        }
      })
      return twitchData.data.data
}
