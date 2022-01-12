const configs = require('../../models/guildConfig');

module.exports = {
    data: {
        name: "xp",
        description: "Manage xp system of your server",
        options: [{
            name: "enable",
            type: 1,
            description: "Enable the XP system in your server",
        }, {
            name: "disable",
            type: 1,
            description: "Disable the XP system in your server",
        }, {
            name: "rate",
            type: 1,
            description: "Change the XP rate of your server",
            options: [{
                name: "rate",
                type: 4,
                required: true,
                description: "The percantage of XP Rate"
            }]
        }, {
            name: "limits",
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
            name: "level-up-message",
            type: 1,
            description: "Change the level up message for your server",
            options: [{
                name: "message",
                type: 3,
                required: true,
                description: "The new level up message, you can use these: {level} {xp} {mention}"
            }]
        }, {
            name: "level-up-message-enable",
            type: 1,
            description: "Enable the XP level up mesage in your server",
        }, {
            name: "level-up-message-disable",
            type: 1,
            description: "Disable the XP level up mesage in your server",
        }, {
            name: "level-up-channel",
            type: 1,
            description: "Change the level up message channel",
            options: [{
                name: "channel",
                type: 3,
                description: "Mention the channel or give ID, 0 for same channel message",
                required: true
            }]
        }, {
            name: "ignore-channel-add",
            type: 1,
            description: "Add ignore XP Channel",
            options: [{
                name: "channel",
                type: 7,
                description: "Mention the channel to disable XP increment",
                required: true
            }]
        }, {
            name: "ignore-channel-remove",
            type: 1,
            description: "remove ignore XP Channel",
            options: [{
                name: "channel",
                type: 7,
                description: "Mention the channel to re-enable XP increment",
                required: true
            }]
        }, {
            name: "level-up-reward-message",
            type: 1,
            description: "Change the level up message for your server",
            options: [{
                name: "success-message",
                type: 3,
                required: false,
                description: "The new level up message, you can use these: {level} {xp} {mention}"
            }, {
                name: "fail-message",
                type: 3,
                required: false,
                description: "The new level up message, you can use these: {level} {xp} {mention}"
            }]
        }, {
            name: "add-level-reward",
            type: 1,
            description: "Add a level reward for your server",
            options: [{
                name: "level",
                type: 3,
                description: "Levle when the user will get this reward",
                required: true
            }, {
                name: "role",
                type: 8,
                description: "The reward role user will get",
                required: true
            }]
        }, {
            name: "remove-level-reward",
            type: 1,
            description: "Remove a level reward for your server",
            options: [{
                name: "level",
                type: 3,
                description: "Level of which you want to remove",
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

        data.levelReward = data.levelReward || {};

        const rate = interaction.options.getInteger("rate"),
            ul = Math.floor(interaction.options.getInteger("up-limit")),
            dl = Math.floor(interaction.options.getInteger("down-limit")),
            message = interaction.options.getString("message"),
            s_message = interaction.options.getString("success-message"),
            f_message = interaction.options.getString("fail-message"),
            role = interaction.options.getRole("role"),
            level = interaction.options.getString("level"),
            channel = interaction.options.get("channel")?.value;

        if (option === "enable") {
            if (data.xp) return interaction.editReply({ content: "XP System is already enabled" });

            interaction.editReply({ content: "XP System is now enabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { xp: true })
        } else if (option === "disable") {
            if (!data.xp) return interaction.editReply({ content: "XP System is already disabled" });

            interaction.editReply({ content: "XP System is now disabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { xp: false })
        } else if (option === "rate") {
            if (rate < 0 || rate > 1000) return interaction.editReply({ content: "Please provide valid XP Rate from 1% to 1000% ( you don't have to type % just the number will work )" })

            interaction.editReply({ content: `XP rate is change to ${rate}%` });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { xpRate: rate / 100 })
        } else if (option === "limits") {
            if (dl > ul || ul < 0 || ul > 1000 || dl < 0 || dl > 1000) return interaction.editReply({ content: "Please provide valid XP increment limits from 1 to 1000 and up limit should be more than down limit" })
            if (!dl && !ul) return interaction.editReply({ content: "Please provide either of the XP increment limit i.e. up or down" })

            ul = ul || data.xpLimit.up;
            dl = dl || data.xpLimit.down;

            interaction.editReply({ content: `XP increment is change to:\nup limit: ${ul}\ndown limit: ${dl}` });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLimit.up": ul, "xpLimit.down": dl })
        } else if (option === "level-up-message-enable") {
            if (data.xpLevelUp.xp) return interaction.editReply({ content: "XP level up message is already enabled" });

            interaction.editReply({ content: "XP level up message is now enabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.enable": true })
        } else if (option === "level-up-message-disable") {
            if (!data.xpLevelUp.xp) return interaction.editReply({ content: "XP level up message is already disabled" });

            interaction.editReply({ content: "XP level up message is now disabled" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.enable": false })
        } else if (option === "level-up-message") {
            interaction.editReply({ content: "XP level up message is now changed" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.message": message })
        } else if (option === "level-up-channel") {
            let c = interaction.guild.channels.cache.get(channel) || interaction.guild.channels.cache.get(channel.substring(2, channel.length - 1))

            if ((!c && channel !== "0") || (c && channel !== "0" && c.type !== "GUILD_TEXT"))
                return interaction.editReply({ content: "Either type 0 for same channel message or give a valid Text channel ID" });

            interaction.editReply({ content: "XP level up message channel is now changed" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { "xpLevelUp.channel": channel === "0" ? channel : c.id })
        } else if (option === "ignore-channel-add") {
            if (data.ignoreXP.includes("channel"))
                return interaction.editReply({ content: "Yo nerd this channel is already disabled for xp increment" });

            interaction.editReply({ content: "Now the mentioned channel will not get xp incremenets" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { $push: { ignoreXP: channel.id } })
        } else if (option === "ignore-channel-remove") {
            if (!data.ignoreXP.includes("channel"))
                return interaction.editReply({ content: "Yo nerd, this channel is not disabled for xp increment" });

            interaction.editReply({ content: "Now the mentioned channel will get xp incremenets" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { $pull: { ignoreXP: channel.id } })
        } else if (option === "level-up-reward-message") {
            if (!s_message && !f_message) return interaction.editReply("Either provide success message or failed message.");

            interaction.editReply({ content: "Level Up reward message(s) changed successfully" });

            await configs.findOneAndUpdate({ id: interaction.guild.id }, {
                levelRewardMessage: {
                    success: s_message || data.levelRewardMessage.success,
                    fail: s_message || data.levelRewardMessage.fail,
                }
            })
        } else if (option === "remove-level-reward") {
            if (!data.levelReward[level]) return interaction.editReply("Yo, you don't have any level reward for this level.");

            interaction.editReply({ content: "Level Up reward removed successfully" });

            data.levelReward[level] = "0";

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { levelReward: data.levelReward })
        } else if (option === "add-level-reward") {
            if (data.levelReward[level] === role.id) return interaction.editReply("Yo, this level reward for this level already exist.");

            interaction.editReply({ content: "Level Up reward updated successfully" });

            data.levelReward[level] = role.id;

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { levelReward: data.levelReward })
        }
    }
}