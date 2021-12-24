const { Schema, model } = require('mongoose');

const userXPConfig = new Schema({
    user: String,
    guild: String,
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    lastXP: {
        type: Number,
        default: 0
    },
})

module.exports = model("User_XP", userXPConfig);
