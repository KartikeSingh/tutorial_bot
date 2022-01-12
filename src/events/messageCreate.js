const guildConfigs = require('../models/guildConfig');
const users = require('../models/userConfig');
const pokecord = require('pokecord');
const { MessageEmbed, MessageCollector } = require('discord.js');

module.exports = async (client, message) => {
    const p = "";
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
        .setDescription(`Catch pokemon by typing \`${p}catch < pokemon name >\``);

    const msg = await channel.send({ embeds: [embed] });

    let catched = false;

    msg.channel.awaitMessages({
        time: 60000,
        errors: ['time'],
        filter: (m) => m.content.toLowerCase() === `${p}catch ${pokemon.name.toLowerCase()}` || m.content.toLowerCase() === `${p}c ${pokemon.name.toLowerCase()}`,
        max: 1
    }).then(async col => {
        catched = true;
        const msg = col.first();

        await users.findOneAndUpdate({ user: msg.author.id }, { $push: { pokemons: pokemon.id } }) || await users.create({
            user: msg.author.id,
            pokemons: [pokemon.id]
        });

        msg.reply(`You successfully caught \`${pokemon.name}\` pokemon`);
    }).catch(() => {
        embed.setTitle("Pokemon ran away")
            .setImage(pokemon.imageURL)
        msg.edit({ embeds: [embed] });
    })

    const col = new MessageCollector(message.channel, { filter: (m) => m.content.toLowerCase() === `${p}h` || m.content.toLowerCase() === `${p}hint`, time: 55000 })

    let t = 0;
    col.on('collect', (msg) => {
        if (catched) return col.stop();

        if (Date.now() - t < 10000) return msg.reply("You are on a timeout to use the hint command");
        t = Date.now();

        let hint = pokemon.name, i = pokmeon.name.length / 2;

        while (--i >= 0) {
            let p = Math.floor(Math.random() * pokemon.length);

            hint = hint.replace(hint[p], "_")
        }

        msg.reply(`Hint for this pokemon is ${hint}`)
    })
}