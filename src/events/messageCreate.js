const configs = require('../models/guildConfig');
const pokecord = require('pokecord');
const users = require('../models/userConfig');
const { MessageEmbed, Message } = require('discord.js');

/**
 * 
 * @param {*} client 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (client, message) => {
    if (message.author.bot) return;

    const data = await configs.findOne({ id: message.guild.id });

    if (!data || !data.pokemon.spawn || Date.now() - data.pokemon.lastMessage < 5000) return;
    data.pokemon.points += Math.floor(Math.random() * 3 + 1);

    if (data.pokemon.points < data.pokemon.afterPoints) return configs.findOneAndUpdate({ id: message.guild.id }, { "pokemon.points": data.pokemon.points, "pokemon,lastMessage": Date.now() });
    await configs.findOneAndUpdate({ id: message.guild.id }, { "pokemon.points": 0, "pokemon,lastMessage": Date.now() });

    const pokemon = await pokecord.Spawn();
    const embed = new MessageEmbed()
        .setTitle("A new pokemon has appeared")
        .setImage(pokemon.imageURL)
        .setDescription(`Catch pokemon by typing \`catch < pokemon name >\``);

    const msg = await message.channel.send({ embeds: [embed] });

    message.channel.awaitMessages({
        time: 60000,
        errors: ['time'],
        filter: (m) => m.content.toLowerCase() === `catch ${pokemon.name.toLowerCase()}`,
        max: 1
    }).then(async v => {
        console.log(v.first())
        await users.findOneAndUpdate({ user: v.first().author.id }, { $push: { pokemons: pokemon.id } }) || await users.create({
            user: v.first().author.id,
            pokemons: [pokemon.id]
        });

        v.first().reply(`You successfully caught \`${pokemon.name}\` pokemon`);
    }).catch(e => {
        msg.reply(`No one replied with correct name & syntax, So the pokemon is gone.\nThe name of the pokemon was : \`${pokemon.name}\``);
    })
}