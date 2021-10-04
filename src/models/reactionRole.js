const { Schema, model } = require('mongoose');

const RoleMenu = new Schema({
    guild: String,
    message: String,
    name: String,
    roles: [
        {
            role: String,
            emoji: String
        }
    ],
})

module.exports = model("Reaction_Role", RoleMenu);