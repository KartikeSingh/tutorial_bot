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
            description: "Disable the XP system in your server",
        }, {
            name: "xp-rate",
            type: 1,
            description: "Change the XP rate of your server",
            options: [{
                name: "rate",
                type: 4,
                required: true,
                description: "The percantage of XP Rate"
            }]
        }, {
            name: "xp-limits",
            type: 1,
            description: "Change the XP icrement limits for your server",
            options: [{
                name: "up-limit",
                type: 4,
                required: false,
                description: "The maximum XP increment"
            }, {
                name: "down-limit",
                type: 4,
                required: false,
                description: "The minimum XP increment"
            }]
        }, {
            name: "xp-level-up-message",
            type: 1,
            description: "Change the level up message for your server",
            options: [{
                name: "message",
                type: 3,
                required: true,
                description: "The new level up message, you can use these: {level} {xp} {mention}"
            }]
        }, {
            name: "xp-level-up-message-enable",
            type: 1,
            description: "Enable the XP level up mesage in your server",
        }, {
            name: "xp-level-up-message-disable",
            type: 1,
            description: "Disable the XP level up mesage in your server",
        }, {
            name: "xp-level-up-channel",
            type: 1,
            description: "Change the level up message channel",
            options: [{
                name: "channel",
                type: 3,
                description: "Mention the channel or give ID, 0 for same channel message",
                required: true
            }]
        }, {
            name: "xp-ignore-channel-add",
            type: 1,
            description: "Add ignore XP Channel",
            options: [{
                name: "channel",
                type: 7,
                description: "Mention the channel to disable XP increment",
                required: true
            }]
        }, {
            name: "xp-ignore-channel-remove",
            type: 1,
            description: "remove ignore XP Channel",
            options: [{
                name: "channel",
                type: 7,
                description: "Mention the channel to re-enable XP increment",
                required: true
            }]
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

        const rate = interaction.options.getInteger("rate"),
            ul = Math.floor(interaction.options.getInteger("up-limit")),
            dl = Math.floor(interaction.options.getInteger("down-limit")),
            message = interaction.options.getString("message"),
            channel = interaction.options.get("channel").value;

        if (option === "xp-enable") {
            if (data.xp) return interaction.editReply({ content: "XP System is already enabled" });

            interaction.editReply({ content: "XP System is now enabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { xp: true })
        } else if (option === "xp-disable") {
            if (!data.xp) return interaction.editReply({ content: "XP System is already disabled" });

            interaction.editReply({ content: "XP System is now disabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { xp: false })
        } else if (option === "xp-rate") {
            console.log(rate)
            if (rate < 0 || rate > 1000) return interaction.editReply({ content: "Please provide valid XP Rate from 1% to 1000% ( you don't have to type % just the number will work )" })

            interaction.editReply({ content: `XP rate is change to ${rate}%` });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { xpRate: rate / 100 })
        } else if (option === "xp-limits") {
            if (dl > ul || ul < 0 || ul > 1000 || dl < 0 || dl > 1000) return interaction.editReply({ content: "Please provide valid XP increment limits from 1 to 1000 and up limit should be more than down limit" })
            if (!dl && !ul) return interaction.editReply({ content: "Please provide either of the XP increment limit i.e. up or down" })

            ul = ul || data.xpLimit.up;
            dl = dl || data.xpLimit.down;

            interaction.editReply({ content: `XP increment is change to:\nup limit: ${ul}\ndown limit: ${dl}` });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLimit.up": ul, "xpLimit.down": dl })
        } else if (option === "xp-level-up-message-enable") {
            if (data.xpLevelUp.xp) return interaction.editReply({ content: "XP level up message is already enabled" });

            interaction.editReply({ content: "XP level up message is now enabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.enable": true })
        } else if (option === "xp-level-up-message-disable") {
            if (!data.xpLevelUp.xp) return interaction.editReply({ content: "XP level up message is already disabled" });

            interaction.editReply({ content: "XP level up message is now disabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.enable": false })
        } else if (option === "xp-level-up-message") {
            interaction.editReply({ content: "XP level up message is now changed" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.message": message })
        } else if (option === "xp-level-up-channel") {
            let c = interaction.guild.channels.cache.get(channel) || interaction.guild.channels.cache.get(channel.substring(2, channel.length - 1))

            if ((!c && channel !== "0") || (c && channel !== "0" && c.type !== "GUILD_TEXT"))
                return interaction.editReply({ content: "Either type 0 for same channel message or give a valid Text channel ID" });

            interaction.editReply({ content: "XP level up message channel is now changed" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.channel": channel === "0" ? channel : c.id })
        } else if (option === "xp-ignore-channel-add") {
            if (data.ignoreXP.includes("channel"))
                return interaction.editReply({ content: "Yo nerd this channel is already disabled for xp increment" });

            interaction.editReply({ content: "Now the mentioned channel will not get xp incremenets" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { $push: { ignoreXP: channel.id } })
        } else if (option === "xp-ignore-channel-remove") {
            if (!data.ignoreXP.includes("channel"))
                return interaction.editReply({ content: "Yo nerd, this channel is not disabled for xp increment" });

            interaction.editReply({ content: "Now the mentioned channel will get xp incremenets" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { $pull: { ignoreXP: channel.id } })
        }
    }
}