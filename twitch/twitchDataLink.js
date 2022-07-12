const { default: axios } = require("axios")
const { env } = require("process")
const UserDataModel = require("../schemas/user-schemas")

exports.getTwitchData = async ( dataLink , id="id") => {

  const user = await UserDataModel.findOne({mail: "martinkr90@googlemail.com"})

      const twitchData = await axios.get(`${dataLink}?${id}=${user.twitchId}`, {
        headers: {
          Authorization: `Bearer ${user.twitchToken}`,
          'Client-ID': env.TWITCH_CLIENT_ID,
        }
      })
      return twitchData.data.data
}
