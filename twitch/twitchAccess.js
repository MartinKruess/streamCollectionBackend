// ClientID: s1rsi30mx2qpx9f2dki63i3y882sg9
// Secret: 1m9bnip2p8iyb9vxypmavr1igvkaxb
// App Access Token: wcpi4cd9xyd9qs4hiul986vf283v1j

const getTwitchUSerData = async () => {

    try {
      const twitchData = await axios.post(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
        headers: {
          Authorization: `Bearer ${env.APP_ACCESS_TOKEN}`,
          'Client-ID': env.TWITCH_CLIENT_ID_NEW
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