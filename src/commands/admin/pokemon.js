const guildConfig = require('../../models/guildConfig');

module.exports = {
    data: {
        name: "pokemon",
        description: "Manage pokemon game for your server",
        options: [{
            name: "enable-spawn",
            type: 1,
            description: "Enable pokemon spawning",
            options: []
        }, {
            name: "disable-spawn",
            type: 1,
            description: "Disable pokemon spawning",
            options: []
        }, {
            name: "spawn-after",
            type: 1,
            description: "Random pokemon spawn's required points",
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
        }]
    },
    permissions: ["MANAGE_SERVER", "MANAGE_ROLES"],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.reply({ content: `${client.user.username} is thinking...` });
        const data = await guildConfig.findOne({ id: interaction.guildId }) || await guildConfig.create({ id: interaction.guildId });
        const command = interaction.options.getSubcommand();

        if (command === "enable-spawn") {
            if (data.pokemon.spawn) return interaction.editReply({ content: "The pokemon spawn is already enabled" });
            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "pokemon.spawn": true });

            interaction.editReply({ content: "Enabled pokemon spawning" });
        } else if (command === "disable-spawn") {
            if (!data.pokemon.spawn) return interaction.editReply({ content: "The pokemon spawn is already disabled" });
            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "pokemon.spawn": false });

            interaction.editReply({ content: "Disabled pokemon spawning" });
        } else if (command === "spawn-after") {
            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "pokemon.afterPoints": interaction.options.getInteger("number") });

            interaction.editReply({ content: `Pokemon spawning required points are not setted to ${interaction.options.getInteger("number")}` });
        } else if (command === "spawn-channel") {
            let raw = interaction.options.getString("channel"), channel = raw === "0" ? raw : interaction.guild.channels.cache.get(raw) || interaction.guild.channels.cache.get(raw.substring(2, raw.length - 1));

            if (!channel || (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS")) return interaction.editReply("Invalid channel was provided, either type 0 for same channel, or mention / give id of a text channel")
            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "pokemon.spawnAt": channel });

            interaction.editReply({ content: `${channel === "0" ? "Setted the pokemon spawning to the same channel where latest message was sent" : `Now pokemons will spawn it <#${channel.id}>`}` });
        }
    }
}