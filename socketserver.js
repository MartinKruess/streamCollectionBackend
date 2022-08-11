const { Server } = require('socket.io')
const tmi = require('tmi.js');

// Fireclient zum Testen

const options = {
    options: {
        //debug: true
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: 'StreamCollTestBot',
        password: 'oauth:o3iwca821zd1bwvdn5rf88fi63x7f0'
    },
    channels: ['RaikunGaming']
}

// Twitch Chat connection but no posts
// UN: StreamCollTestBot PW: StreamColl_TestBot
// Chat wird mitgelesen
const messages = [
    {
        msgTime: "",
        viewerName: "",
        viewerMsg: "",
    }
]

exports.socketServer = (httpServer) => {
    // Hook in Socket.io server into Express API
    const io = new Server(httpServer,
        //{ cors: { origin: process.env.FRONTEND_ORIGIN } }
        { cors: "*"}
    )

    // every browser tab => own socket
    console.log("SocketServer listening to frontend!")
    io.on("connection", (socket) => {
        socket.twitchClient = new tmi.client(options)
        socket.twitchClient.connect()

        // Connection to Twitch Chat io
        socket.twitchClient.on('connected', (address, port) => {
            //socket.twitchClient.action('StreamCollTestBot', '')
        })

        // Read Message from Twitch
        socket.twitchClient.on('message', (channel, tags, message, self) => {
            const chatMessageToFront = {
                badges: tags.badges,
                emotes: tags.emotes,
                emoteOnly: tags["emote-only"],
                firstMSG: tags["first-msg"],
                id: tags.id,
                mod: tags.mod,
                returningChatter: tags["returning-chatter"],
                subscriber: tags.subscriber,
                turbo: tags.turbo,
                userID: tags["user-id"],
                emotesRaw: tags["emotes-raw"],
                username: tags.username,
                messageType: tags["message-type"],
                message: message,
                timestamp: Date.now(),
            }
            socket.emit('message', chatMessageToFront)
            if (self) return;

            if (message.toLowerCase() === '!commands') {
                console.log(`Twitch Chat Ausgabe -> ${tags.username}: ${message.message}`)
                socket.twitchClient.say(channel, `@${tags.username}, Das hier sind die commands!`);
            }
        });


        // setup an event listener
        // message = direct line channel
        socket.on("message", (data) => {

            // forward message to everyone else
            socket.broadcast.emit("message", data)
            socket.twitchClient.say(data.channel, `${data.username}: ${data.message}`);
        })

        socket.on('disconnecting', () => {
            socket.twitchClient.disconnect()
        })
    })
}