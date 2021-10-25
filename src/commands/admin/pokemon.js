const guildConfig = require('../../models/guildConfig');

module.exports = {
    data: {
        name: "pokemon",
        description: "Setup the pokemon game for your server",
        options: [{
            name: "enable-spawn",
            type: 1,
            description: "Enable the slash commands"
        }, {
            name: "disable-spawn",
            type: 1,
            description: "Disable the slash commands"
        }, {
            name: "spawn-after",
            type: 1,
            description: "Random pokemon spawning points",
            options: [{
                name: "number",
                type: 4,
                description: "Number of points",
                required: true
            }]
        }, {
            name: "spawn-channel",
            type: 1,
            description: "Set the random pokemon spawn's channel",
            options: [{
                name: "channel",
                type: 3,
                description: "Mention or give ID, 0 for same channel spawn",
                required: true
            }]
        }],
    },
    permissions: ["MANAGE_SERVER"],

    run: async (client, interaction) => {
        await interaction.deferReply();
        const data = await guildConfig.findOne({ id: interaction.guildId }) || await guildConfig.create({ id: interaction.guildId });
        const command = interaction.options.getSubcommand();

        if (command === "enable-spawn") {
            if (data.pokemon.spawn) return interaction.editReply({ content: `The pokemon spawning is already enabled` });

            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "pokemon.spawn": true });

            interaction.editReply({ content: "Enabled pokemon spawning" });
        } else if (command === "disable-spawn") {
            if (data.pokemon.spawn) return interaction.editReply({ content: `The pokemon spawning is already disabled` });

            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "pokemon.spawn": false });

            interaction.editReply({ content: "disabled pokemon spawning" });
        } else if (command === "spawn-after") {
            const points = interaction.options.getInteger("number");

            if (points < 10) return interaction.editReply({ content: "The points can't be below 10" });

            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "pokemon.afterPoints": points });

            interaction.editReply({ content: `Pokemon spawning required points are not setted to ${points}` });
        } else if (command === "spawn-channel") {
            const raw = interaction.options.getString("channel"), channel = raw === "0" ? raw : interaction.guild.channels.cache.get(raw) || interaction.guild.channels.cache.get(raw.substring(2, raw.length - 1));


            if (!channel || (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS")) return interaction.editReply("Invalid channel was provided, either type 0 for same channel, or mention / give id of a text channel")
            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "pokemon.spawnAt": channel === "0" ? "0" : channel.id });

            interaction.editReply({ content: `${channel === "0" ? "Setted the pokemon spawning to the same channel where latest message was sent" : `Now pokemons will spawn it <#${channel.id}>`}` });
        }

    }
}