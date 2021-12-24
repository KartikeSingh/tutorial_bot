const configs = require('../../models/guildConfig');

module.exports = {
    data: {
        name: "xp",
        description: "Manage xp system of your server",
        options: [{
            name: "xp-enable",
            type: 1,
            description: "Enable the XP system in your server",
        }, {
            name: "xp-disable",
            type: 1,
            description: "Enable the XP system in your server",
        }]
    },
    permissions: ["MANAGE_SERVER"],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.reply({ content: `${client.user.username} is thinking...` });

        const option = interaction.options.getSubcommand(true).toLowerCase(),
            data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id });

        if (option === "xp-enable") {
            if (data.xp) return interaction.editReply({ content: "XP System is already enabled" });

            interaction.editReply({ content: "XP System is now enabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { xp: true })
        } else if (option === "xp-disable") {
            if (!data.xp) return interaction.editReply({ content: "XP System is already disabled" });

            interaction.editReply({ content: "XP System is now disabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { xp: false })
        }
    }
}