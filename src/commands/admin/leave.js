const guildConfig = require('../../models/guildConfig');

module.exports = {
    data: {
        name: "leave",
        description: "Setup the leave configuration for your server",
        options: [{
            name: "enable",
            description: "Enable the leave module for your server",
            type: 1,
            options: [{
                name: "channel",
                description: "Channel where you want leave messages",
                type: 7,
                required: true
            }]
        }, {
            name: "disable",
            description: "Disable the leave module for your server",
            type: 1
        }, {
            name: "set-message",
            description: "Change the leave message for your server",
            type: 1,
            options: [{
                name: "message",
                description: "The leave message, keys : {mention} {user} {server} {members}",
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
            if (data.leave.enable === true && data.leave.channel === channel.id)
                return interaction.editReply({ content: "The leave module is already enabled and the channel you provided is already the leave channel" });

            if (!channel || (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS"))
                return interaction.editReply("Invalid channel was provided, Please provide a text channel")

            data.leave = {
                channel: channel.id,
                enable: true,
                message: data.leave.message
            }

            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { leave: data.leave });

            interaction.editReply({ content: `The leave module is now enabled and the leave channel is now setted to ${channel.toString()}` });
        } else if (command === "disable") {
            if (data.leave.enable !== true)
                return interaction.editReply({ content: "The leave module is already disabled" });

            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "leave.enable": false });

            interaction.editReply({ content: "The leave module is now disabled" });
        } else if (command === "set-message") {
            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { "leave.message": message });

            interaction.editReply({
                content: `The leave message is changed${data.leave.enable === false ? " btw, the leave module is disabled" : ""}`
            });
        }
    }
}