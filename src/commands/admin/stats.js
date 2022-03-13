const { CommandInteraction } = require('discord.js');
const stats = require('../../models/guildStats');

module.exports = {
    data: {
        name: "stats",
        description: "Configure the stats for your server",
        options: [{
            name: "type",
            type: 3,
            required: true,
            description: "What kind of stats you want to setup",
            choices: [{
                name: "members-stats",
                value: "members"
            }]
        }, {
            name: "channel",
            type: 7,
            required: false,
            description: "The voice channel in which you wanna show the stats"
        }]
    },
    permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS"],

    /**
     * 
     * @param {*} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        interaction.deferReply();
        const channel = interaction.options.getChannel("channel") || await interaction.guild.channels.create(`Members : ${interaction.guild.memberCount}`, {
            reason: "for stats",
            type: "GUILD_VOICE"
        });

        const newData = { guild: interaction.guildId };
        newData[interaction.options.getString("type")] = channel.id;

        const data = await stats.findOneAndUpdate({ guild: interaction.guildId }, newData, { new: true }) || await stats.create(newData);

        interaction.editReply({ content: `Added stats for ${interaction.options.getString("type")}` });
    }
}