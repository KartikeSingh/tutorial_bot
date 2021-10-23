const { Schema, model } = require('mongoose');

const guildStats = new Schema({
    id: String,
    pokemon: {
        spawn: {
            type: Boolean,
            default: false
        },
        afterPoints: {
            type: Number,
            default: 100
        },
        points: {
            type: Number,
            default: 0
        },
        spawnAt: String,
        lastMessage: String
    },
})

module.exports = model("Guild_Config", guildStats);