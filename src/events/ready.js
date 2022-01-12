const timers = require('../models/timer');
const startTimer = require('../utility/startTimer');

module.exports = async (client) => {
    console.log("Client is up");
// 926705336675631195
    client.application.commands.set([...client.commands.map(v => v.data)], "926705336675631195");

    // Reloading the timers
    const data = await timers.find();

    data.forEach((timer) => {
        startTimer(client, timer);
    })
}