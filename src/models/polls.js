const { Schema, model } = require('mongoose');

const Poll = new Schema({
    question: String,
    message: String,
    channel: String,
    guild: String,
    votes: Object,
    voters: {
        type: [String],
        default: []
    },
    emojis: [String],
    ended: {
        type: Boolean,
        default: false
    }
})

module.exports = model("polls", Poll);