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
    },

    ignoreXP: [String],
    xp: {
        type: Boolean,
        default: false
    },
    xpTimeout: {
        type: Number,
        default: 60000
    },
    xpLevelUp: {
        message: {
            type: String,
            default: "Congrats {mention} 🎉 on reaching {level} level"
        },
        channel: {
            type: String,
            default: "0"
        },
        enable: {
            type: Boolean,
            default: true
        }
    },
    xpRate: {
        type: Number,
        default: 1
    },
    xpLimit: {
        up: {
            type: Number,
            default: 20
        },
        down: {
            type: Number,
            default: 5
        },
    },
    tags: [{
        name: String,
        response: String,
        embed: Boolean,
        case: Boolean,
        include: Boolean,
    }],
    levelRewardMessage: {
        success: {
            type: String,
            default: "Congrats {mention} 🎉 on reaching {level} level, and you got **{role}** role as a reward 🎉"
        },
        fail: {
            type: String,
            default: "Congrats {mention} 🎉 on reaching {level} level, you were supposed to get **{role}** role as a reward but I was unable to give you the role"
        },
    },
    levelReward: Object,
    /**
     levelReward = {
         "1": "roleid-1",
         2: "another-id"
         // etc
     }
     */
    leave: {
        enable: {
            type: Boolean,
            default: false
        },
        channel: String,
        message: {
            type: String,
            default: `**{user}** left the server.`
        }
    },
    suggestion:String
})

module.exports = model("Guild_Config", guildStats);