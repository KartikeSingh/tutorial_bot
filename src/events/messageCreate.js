const guildConfigs = require('../models/guildConfig');
const users = require('../models/userConfig');
const pokecord = require('pokecord');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, message) => {
    if (message.author.bot) return;

    const data = await guildConfigs.findOne({ id: message.guild.id });

    if (!data || !data.pokemon.spawn) return;

    data.pokemon.points += Math.floor(Math.random() * 3) + 1;

    if (data.pokemon.points < data.pokemon.afterPoints) return guildConfigs.findOneAndUpdate({ id: message.guild.id }, { "pokemon.points": data.pokemon.points });

    await guildConfigs.findOneAndUpdate({ id: message.guild.id }, { "pokemon.points": 0 });

    const pokemon = await pokecord.Spawn();

    const channel = message.guild.channels.cache.get(data.pokemon.spawnAt) || message.channel;

    const embed = new MessageEmbed()
        .setTitle("A new pokemon has appeared")
        .setImage(pokemon.imageURL)
        .setDescription(`Catch pokemon by typing \`catch < pokemon name >\``);

    const msg = await channel.send({ embeds: [embed] });

    msg.channel.awaitMessages({
        time: 60000,
        errors: ['time'],
        filter: (m) => m.content.toLowerCase() === `catch ${pokemon.name.toLowerCase()}`,
        max: 1
    }).then(async col => {
        const msg = col.first();

        await users.findOneAndUpdate({ user: msg.author.id }, { $push: { pokemons: pokemon.id } }) || await users.create({
            user: msg.author.id,
            pokemons: [pokemon.id]
        });

        msg.reply(`You successfully caught \`${pokemon.name}\` pokemon`);
    }).catch(() => {
        msg.reply(`No one replied with correct name & syntax, So the pokemon is gone.\nThe name of the pokemon was : \`${pokemon.name}\``);
    })
}