const stats = require('../../models/guildStats');

module.exports = {
    data: {
        name: "stats",
        description: "Setup stats for your server",
        type: 1,
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
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel", false) || await interaction.guild.channels.create(`Members : ${interaction.guild.memberCount}`, {
            reason: "For stats",
            type: "GUILD_VOICE"
        });

        const newData = { guild: interaction.guildId };
        newData[interaction.options.getString("type")] = channel.id;

        const data = await stats.findOneAndUpdate({ guild: interaction.guildId }, newData, { new: true }) || await stats.create(newData);

        interaction.reply({ content: `Added stats for ${interaction.options.getString('type')}` });
    }
}