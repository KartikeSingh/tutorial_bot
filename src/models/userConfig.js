const { Schema, model } = require('mongoose');

const userConfig = new Schema({
    user: String,
    pokemons: [String],
    badges:[String]
})

module.exports = model("User_Pokemons", userConfig);