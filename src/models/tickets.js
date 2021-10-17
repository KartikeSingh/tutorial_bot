const { Schema, model } = require('mongoose');

const Tickets = new Schema({
    name: String,
    guild: String,
    index: { type: Number, default: 0 },
    message: {
        type: String,
        default: 0
    },
    moderators: {
        type: [String],
        default: []
    },
    banned: {
        type: [String],
        default: []
    }
})

module.exports = model("ticket_panels", Tickets);