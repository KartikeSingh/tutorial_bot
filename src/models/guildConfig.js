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
    welcome: {
        enable: Boolean,
        channel: String,
        message: {
            type: String,
            default: "Welcome {mention}, To **{server}**\nNow we are a family of {members}"
        }
    }
})

module.exports = model("Guild_Config", guildStats);