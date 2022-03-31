const { MessageActionRow, MessageButton } = require("discord.js");
const guildConfig = require("../../models/guildConfig")
const suggestions = require("../../models/suggestion")

module.exports = {
    data: {
        name: "suggestion",
        description: "Create or reply to suggestions",
        options: [{
            name: "create",
            type: 1,
            description: "Create a suggestion",
            options: [{
                name: "suggestion",
                type: 3,
                required: true,
                description: "The suggesiton you want to give"
            }]
        }, {
            name: "reply",
            type: 1,
            description: "Reply to a suggesiton",
            options: [{
                name: "id",
                type: 3,
                required: true,
                description: "The suggestion to which you want to reply"
            }, {
                name: "status",
                type: 3,
                required: true,
                description: "Set the status of this suggestion",
                choices: [{
                    name: "Accepted",
                    value: "1"
                }, {
                    name: "Rejected",
                    value: "2"
                }]
            }, {
                name: "response",
                type: 3,
                required: true,
                description: "The response to this status"
            }]
        }, {
            name: 'set-channel',
            type: 1,
            description: "Select the suggestion channel",
            options: [{
                name: "channel",
                type: 7,
                required: true,
                description: "The channel where I should send the suggestions"
            }]
        }],
    },
    timeout: 1000,

    run: async (client, interaction) => {
        await interaction.deferReply();

        const option = interaction.options.getSubcommand(),
            suggestion = interaction.options.getString("suggestion"),
            channel = interaction.options.getChannel("channel"),
            id = interaction.options.getString("id"),
            status = interaction.options.getString("status"),
            response = interaction.options.getString("response"),
            data = await guildConfig.findOne({ id: interaction.guild.id }) || await guildConfig.create({ id: interaction.guild.id }),
            sug = await suggestions.findOne({ message: id }),
            c = interaction.guild.channels.cache.get(data.suggestion);

        if (option === "create") {
            if (!c) return interaction.editReply({
                embeds: [{
                    title: "❌ Suggestion Not Setuped"
                }]
            });

            const row = new MessageActionRow().addComponents([
                new MessageButton({
                    customId: "1",
                    label: "⬆ Up Vote",
                    style: "SECONDARY"
                }), new MessageButton({
                    customId: "2",
                    label: "⬇ Down Vote",
                    style: "SECONDARY"
                })
            ])

            const msg = await c.send({
                components: [row],
                embeds: [{
                    title: "New Suggestion!",
                    color: "BLUE",
                    description: suggestion,
                    fields: [{
                        name: "Up Votes",
                        value: "0",
                        inline: true
                    }, {
                        name: "Down Votes",
                        value: "0",
                        inline: true
                    }, {
                        name: "Status",
                        value: "pending",
                        inline: true
                    }],
                    footer: {
                        text: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    }
                }]
            });

            await suggestions.create({
                suggestion,
                user: interaction.user.id,
                message: msg.id,
                channel: c.id,
                guild: interaction.guildId,
                votes: {
                    up: 0, down: 0
                },
                createdAt: Date.now(),
            });

            msg.embeds[0].fields.push({
                name: "Suggestion ID",
                value: `\`\`\`\n${msg.id}\n\`\`\``,
                inline: true
            });

            msg.edit({
                embeds: msg.embeds
            });

            interaction.editReply({
                embeds: [{
                    color: "GREEN",
                    title: "✅ Suggestion Created"
                }]
            })
        } else if (option === "reply") {
            if (!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.editReply({
                embeds: [{
                    title: "❌ You are not allowed"
                }]
            });

            if (!sug) return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid Suggestion ID"
                }]
            });

            const msg = await interaction.guild.channels.cache.get(sug.channel)?.messages?.fetch(sug.message);

            if (!msg) return interaction.editReply({
                embeds: [{
                    title: "❌ Suggestion Message is Deleted",
                    description: "This suggestion can no longer be replied"
                }]
            });

            const row = new MessageActionRow().addComponents([
                new MessageButton({
                    customId: "1",
                    label: "⬆ Up Vote",
                    style: "SECONDARY",
                    disabled: true
                }), new MessageButton({
                    customId: "2",
                    label: "⬇ Down Vote",
                    style: "SECONDARY",
                    disabled: true
                })
            ]);

            msg.embeds[0].fields[2].value = status === "1" ? "✅ Accepted" : "❌ Rejected";
            msg.embeds[0].fields.push({
                name: "Response",
                value: response,
            })

            msg.edit({
                embeds: msg.embeds,
                components: [row]
            });

            interaction.editReply({
                embeds: [{
                    color: "GREEN",
                    title: "✅ Suggestion Replied"
                }]
            })
        } else if (option === "set-channel") {
            if (!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.editReply({
                embeds: [{
                    title: "❌ You are not allowed"
                }]
            });

            if (channel.type !== "GUILD_TEXT") return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid Channel Type"
                }]
            });

            await guildConfig.findOneAndUpdate({ id: interaction.guildId }, { suggestion: channel.id });

            interaction.editReply({
                embeds: [{
                    color: "GREEN",
                    title: "✅ Suggestion Setuped!  "
                }]
            })
        }
    }
}