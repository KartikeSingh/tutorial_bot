const { Schema, model } = require('mongoose');

const Timer = new Schema({
    id: String,
    user: String,
    channel: String, // for emergency conditions
    reason: String,
    guild: String, // kinda useless, but might come handy for stats? 
    time: String, // kinda useless, but might come handy for stats?
    createdAt: String, // kinda useless, but might come handy for stats?
    endAt: String,
})

module.exports = model("timer", Timer);