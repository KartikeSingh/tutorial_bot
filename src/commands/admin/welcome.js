const guildConfig = require('../../models/guildConfig');

module.exports = {
    data: {
        name: "welcome",
        description: "Setup the welcome configuration for your server",
        options: [{
            name: "enable",
            description: "Enable the welcome module for your server",
            type: 1,
            options: [{
                name: "channel",
                description: "Channel where you want welcome messages",
                type: 7,
                required: true
            }]
        }, {
            name: "disable",
            description: "Disable the welcome module for your server",
            type: 1
        }, {
            name: "set-message",
            description: "Change the welcome message for your server",
            type: 1,
            options: [{
                name: "message",
                description: "The welcome message, keys : {mention} {user} {server} {members}",
                type: 3,
                required: true
            }]
        }]
    },
    permissions: ["MANAGE_SERVER"],

    run: async (client, interaction) => {
        await interaction.reply({ content: `${client.user.username} is thinking...` });

        const data = await guildConfig.findOne({ id: interaction.guildId }) || await guildConfig.create({ id: interaction.guildId }),
            channel = interaction.options.getChannel("channel"),
            message = interaction.options.getString("message"),
            command = interaction.options.getSubcommand();

        if (command === "enable") {
            if (data.welcome.enable === true && data.welcome.channel === channel.id)
                return interaction.editReply({ content: "The welcome module is already enabled and the channel you provided is already the welcome channel" });

            if (!channel || (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS"))
                return interaction.editReply("Invalid channel was provided, Please provide a text channel")

            data.welcome = {
                channel: channel.id,
                enable: true,
                message: data.welcome.message
            }

            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { welcome: data.welcome });

            interaction.editReply({ content: `The welcome module is now enabled and the welcome channel is now setted to ${channel.toString()}` });
        } else if (command === "disable") {
            if (data.welcome.enable !== true)
                return interaction.editReply({ content: "The welcome module is already disabled" });

            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "welcome.enable": false });

            interaction.editReply({ content: "The welcome module is now disabled" });
        } else if (command === "set-message") {
            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "welcome.message": message });

            interaction.editReply({
                content: `The welcome message is changed${data.welcome.enable === false ? " btw, the welcome module is disabled" : ""}`
            });
        }
    }
}