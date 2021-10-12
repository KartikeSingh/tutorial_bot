const { Schema, model } = require('mongoose');

const guildStats = new Schema({
    guild: String,
    members: String,
})

module.exports = model("Guild_Stats", guildStats);