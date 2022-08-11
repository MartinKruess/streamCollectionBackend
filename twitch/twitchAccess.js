const config = require('../config')

const getTwitchUSerData = async () => {

    try {
      const twitchData = await axios.Post(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
        headers: {
          Authorization: `Bearer ${env.APP_ACCESS_TOKEN}`,
          'Client-ID': config.TWITCH_CLIENT_ID
        }
      })
  
      const dataOfTwitchChannel = {
        userID: 123, //Required!!!
        twitchUserID: twitchData.data.data[0].user_id,
        viewerAverage: viewerAverage.toFixed(2),
        lastAverage: lastAverage
      }
  
      console.log("Data of Twitch Channel", dataOfTwitchChannel)
  
      // SAVE: Data to twitchData
      // await TwitchDataModel(dataOfTwitch).save() PAUSE
      
      //console.log(twitchData.data.data[0].user_id)
  
      
    } catch (err) {
      console.error(err);
    }
  }