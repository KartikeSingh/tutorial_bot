// Importing Lib
const Discord = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Discord.Client({
    intents: ["GUILDS"]
});

client.on('ready', () => {
    console.log("CLient is on!");
})

client.login(process.env.TOKEN);