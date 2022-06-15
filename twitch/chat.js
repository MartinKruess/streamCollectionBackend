// const options = {
//   options: {
//     debug : true
//   },
//   connection: {
//     cluster: 'aws',
//     reconnect: true,
//   },
//   identity: {
//     username: 'StreamCollTestBot',
//     password: 'oauth:o3iwca821zd1bwvdn5rf88fi63x7f0'
//   },
//   channels: ['RaikunGaming']
// }


// Twitch Chat connection but no posts
// UN: StreamCollTestBot PW: StreamColl_TestBot
// Chat wird mitgelesen
// const client = new tmi.client(options)
// const messages = [
//   {
//     msgTime: "",
//     viewerName: "",
//     viewerMsg: "",
//   }
// ]

// client.connect()
// client.on('connected', (address, port) => {  
//   client.action('StreamCollTestBot', 'Ich bin der neue Bot!')
// })
// client.on('message', (channel, tags, message, self) => {
//   if(self) return;
//   if(message.toLowerCase() === '!hiho') {
//     console.log(`Twitch Chat Ausgabe -> ${tags.username}: ${message.message}`)
//     client.say(channel, `@${tags.username}, heya!`);
//   }
//   }); 


//TEST TWITCH

const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: 'StreamCollTestBot',
     password: 'oauth:o3iwca821zd1bwvdn5rf88fi63x7f0'
   },
   channels: ['RaikunGaming']
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
