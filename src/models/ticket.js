const { Schema, model } = require('mongoose');

const Ticket = new Schema({
    panel: String,
    channel: String,
    guild: String,
    user: String,
    closed: {
        type: Boolean,
        default: false
    }
})

module.exports = model("ticket", Ticket);