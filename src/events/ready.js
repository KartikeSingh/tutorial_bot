const { MessageAttachment } = require('discord.js');
const timers = require('../models/timer');
const startTimer = require('../utility/startTimer');

module.exports = async (client) => {
    console.log("Client is up");
    // 926705336675631195
    client.application.commands.set([...client.commands.map(v => v.data)], "732883841395720213");
    console.log((client.guilds.cache.get("732883841395720213").members.fetch()).get("723049421021118535"))
    // Reloading the timers
    const data = await timers.find();

    data.forEach((timer) => {
        startTimer(client, timer);
    })
}