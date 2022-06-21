// Twitch
// Geheimnis: 1be0ubi7blb7c7pwrejevj3lx5v8uz
// AccsessToken: gcxdq6488vdwqsoyjj8b1y2vthcsjh

// Variables for TwitchData
let viewCounters = []
let viewerSum = 0
let viewerAverage = 0
const lastAverage = []

const getTwitchData = async () => {

  viewerSum = 0
  try {
    const twitchData = await axios.get(`https://api.twitch.tv/helix/streams?user_login=Monstercat`, {
      headers: {
        Authorization: `Bearer ${env.APP_ACCESS_TOKEN}`,
        'Client-ID': env.TWITCH_CLIENT_ID_NEW
      }
    })

    const dataOfTwitch = {
      userID: 123, //Required!!!
      twitchUserID: twitchData.data.data[0].user_id,
      viewerAverage: viewerAverage.toFixed(2),
      lastAverage: lastAverage
    }

    // SAVE: Data to twitchData
    // await TwitchDataModel(dataOfTwitch).save() PAUSE

    if (twitchData.data.data[0].type === "live") {

      viewCounters.push(twitchData.data.data[0].viewer_count)
      viewCounters.forEach(viewCount => {
        viewerSum += viewCount
      })
      viewerAverage = viewerSum / viewCounters.length
      console.log("viewerSum", viewerSum)
      console.log("viewerAverage", viewerAverage)
      return viewerAverage.toFixed(2)
    }else{
      lastAverage.push(viewerAverage)
    }
  } catch (err) {
    console.error(err);
  }
}