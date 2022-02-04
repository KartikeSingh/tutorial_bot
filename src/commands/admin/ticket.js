const tickets = require('../../models/tickets');
const ticket = require('../../models/ticket');
const { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } = require('discord.js');

module.exports = {
    data: {
        name: "ticket",
        description: "COnfigure your server's tickets / panels",
        options: [{
            name: "create",
            type: 1,
            description: "Create a ticket panel",
            options: [{
                name: "panel-name",
                description: "The name of the panel you want to create",
                type: 3,
                required: true
            }]
        }, {
            name: "remove",
            type: 1,
            description: "Remove a ticket panel",
            options: [{
                name: "panel-name",
                description: "The name of the panel you want to remove",
                type: 3,
                required: true
            }]
        }, {
            name: "start",
            type: 1,
            description: "Start a ticket panel",
            options: [{
                name: "panel-name",
                description: "The name of the panel you want to start",
                type: 3,
                required: true
            }, {
                name: "channel",
                description: "The channel where you want to start the panel",
                required: true,
                type: 7
            }]
        }, {
            name: "close",
            type: 1,
            description: "Close a openen ticket for your discord server",
        }, {
            name: "re-open",
            type: 1,
            description: "Re-open a closed ticket for your discord server",
        }, {
            name: "delete",
            type: 1,
            description: "Delete a ticket for your discord server",
        }, {
            name: "logs-disable",
            type: 1,
            description: "Disable ticket logs for your server",
            options: [{
                name: "panel-name",
                description: "The name of the panel",
                type: 3,
                required: true
            }]
        }, {
            name: "logs-enable",
            type: 1,
            description: "Enable ticket logs for your server",
            options: [{
                name: "panel-name",
                description: "The name of the panel",
                type: 3,
                required: true
            }, {
                name: "channel",
                type: 7,
                description: "channel to send ticket logs for your server",
                required: true
            }]
        }, {
            name: "moderator-add",
            type: 1,
            description: "Add a moderator role for your server's ticket panel",
            options: [{
                name: "panel-name",
                description: "The name of the panel",
                type: 3,
                required: true
            }, {
                name: "role",
                type: 8,
                description: "The role to add as a moderator",
                required: true
            }]
        }, {
            name: "moderator-remove",
            type: 1,
            description: "Remove a moderator role for your server's ticket panel",
            options: [{
                name: "panel-name",
                description: "The name of the panel",
                type: 3,
                required: true
            }, {
                name: "role",
                type: 8,
                description: "The role to remove from moderator role",
                required: true
            }]
        }, {
            name: "banned-add",
            type: 1,
            description: "Add a banned role for your server's ticket panel",
            options: [{
                name: "panel-name",
                description: "The name of the panel",
                type: 3,
                required: true
            }, {
                name: "role",
                type: 8,
                description: "The role to add as a banned",
                required: true
            }]
        }, {
            name: "banned-remove",
            type: 1,
            description: "Remove a banned role for your server's ticket panel",
            options: [{
                name: "panel-name",
                description: "The name of the panel",
                type: 3,
                required: true
            }, {
                name: "role",
                type: 8,
                description: "The role to remove from banned role",
                required: true
            }]
        }, {
            name: "max-ticket",
            type: 1,
            description: "Set maximum number of tickets a user can create in a pannel",
            options: [{
                name: "panel-name",
                description: "The name of the panel",
                type: 3,
                required: true
            }, {
                name: "limit",
                type: 4,
                description: "The number of tickets a user can create",
                required: true
            }]
        }]
    },
    permissions: ["MANAGE_SERVER"],

    /**
     * 
     * @param {*} client 
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    run: async (client, interaction) => {
        await interaction.deferReply();

        const name = interaction.options.getString("panel-name"),
            ticketData = await ticket.findOne({ guild: interaction.guildId, channel: interaction.channel.id }) || {},
            data = await tickets.findOne({ guild: interaction.guildId, name }) || await tickets.findOne({ guild: interaction.guildId, name: ticketData.panel }),
            command = interaction.options.getSubcommand(),
            channel = interaction.options.getChannel("channel"),
            role = interaction.options.getRole("role"),
            limit = interaction.options.getInteger("limit"),
            modCommands = ["close", "reopen", "delete"],
            permissions = ["MANAGA_SERVER", "MANAGE_CHANNELS"],
            member = interaction.guild.members.cache.get(ticketData?.user);

        if (modCommands.includes(command) && !data?.moderators.some(v => interaction.member.roles.cache.has(v)) && !permissions.some(v => interaction.member.permissions.has(v)))
            return interaction.editReply({ content: `You can not use this command, because you neither have moderator role for this pannel nor any of the following permission ${permissions.join(", ")}` })

        if (!modCommands.includes(command) && !permissions.some(v => interaction.member.permissions.has(v)))
            return interaction.editReply({ content: `You can not use this command, because you do not have any of the following permission ${permissions.join(", ")}` })

        if (command === "create") {
            if (data) return interaction.editReply({ content: `You already have a panel with name \`${name}\`` });
            await tickets.create({ name, guild: interaction.guildId });

            interaction.editReply({ content: `I created a panel with name \`${name}\`` });
        } else if (command === "remove") {
            if (!data) return interaction.editReply({ content: `You do not have a panel with name \`${name}\`` });
            await tickets.findOneAndDelete({ name, guild: interaction.guildId });

            interaction.editReply({ content: `I delete the panel with name \`${name}\`` });
        } else if (command === "start") {
            if (!data) return interaction.editReply({ content: `You do not have a panel with name \`${name}\`` });
            if (channel.type !== "GUILD_TEXT") return interaction.editReply({ content: "Channel should be a text channel" });

            const embed = new MessageEmbed().setTitle(`Panel : ${name}`).setDescription("click on 📩 to create a ticket");
            const row = new MessageActionRow().addComponents(new MessageButton().setCustomId("ticket_button").setLabel("Create Ticket").setEmoji("📩").setStyle("PRIMARY"));

            channel?.send({ embeds: [embed], components: [row] }).then(async v => {
                console.log(v)
                await tickets.findOneAndUpdate({ guild: interaction.guildId, name }, { message: v.id });
                interaction.editReply({ content: `Successfully started the panel with name : \`${name}\` in ${channel.toString()}` })
            }).catch(e => {
                interaction.editReply({ content: `Unable to send the message in ${channel.toString()}` })
            })
        } else if (command === "logs-disable") {
            if (!data) return interaction.editReply({ content: `You do not have a panel with name \`${name}\`` });

            await tickets.findOneAndUpdate({ guild: interaction.guildId, name }, { logs: "0" });
            interaction.editReply({ content: "Successfully disabled Ticket logs for this server." });
        } else if (command === "logs-enable") {
            if (!data) return interaction.editReply({ content: `You do not have a panel with name \`${name}\`` });

            if (channel.type !== "GUILD_TEXT") return interaction.editReply({ content: "Channel should be a text channel" });

            await tickets.findOneAndUpdate({ guild: interaction.guildId, name }, { logs: channel.id });
            interaction.editReply({ content: "Successfully enable Ticket logs for this server in " + channel.toString() });
        } else if (command === "moderator-add") {
            if (!data) return interaction.editReply({ content: `You do not have a panel with name \`${name}\`` });
            if (data.moderators?.includes(role.id)) return interaction.editReply({ content: `This role is already a moderator role in the panel \`${data.name}\`` });

            await tickets.findOneAndUpdate({ guild: interaction.guildId, name }, { $push: { moderators: role.id } });
            interaction.editReply({ content: `Successfully added **${role.name}** as a moderator role in the panel \`${data.name}\`` });
        } else if (command === "moderator-remove") {
            if (!data) return interaction.editReply({ content: `You do not have a panel with name \`${name}\`` });
            if (!data.moderators?.includes(role.id)) return interaction.editReply({ content: `This role is not a moderator role in the panel \`${data.name}\`` });

            await tickets.findOneAndUpdate({ guild: interaction.guildId, name }, { $pull: { moderators: { $in: role.id } } });
            interaction.editReply({ content: `Successfully remove **${role.name}** from moderator roles in the panel \`${data.name}\`` });
        } else if (command === "banned-add") {
            if (!data) return interaction.editReply({ content: `You do not have a panel with name \`${name}\`` });
            if (data.banned?.includes(role.id)) return interaction.editReply({ content: `This role is already a banned role in the panel \`${data.name}\`` });

            await tickets.findOneAndUpdate({ guild: interaction.guildId, name }, { $push: { banned: role.id } });
            interaction.editReply({ content: `Successfully added **${role.name}** as a banned role in the panel \`${data.name}\`` });
        } else if (command === "banned-remove") {
            if (!data) return interaction.editReply({ content: `You do not have a panel with name \`${name}\`` });
            if (!data.banned?.includes(role.id)) return interaction.editReply({ content: `This role is not a banned role in the panel \`${data.name}\`` });

            await tickets.findOneAndUpdate({ guild: interaction.guildId, name }, { $pull: { banned: { $in: role.id } } });
            interaction.editReply({ content: `Successfully remove **${role.name}** from banned roles in the panel \`${data.name}\`` });
        } else if (command === "max-ticket") {
            if (!data) return interaction.editReply({ content: `You do not have a panel with name \`${name}\`` });
            if (limit < 1 || limit > 1000) return interaction.editReply({ content: "The maximum ticket limit can't be less than 1 or greater than 1000" });

            await tickets.findOneAndUpdate({ guild: interaction.guildId, name }, { max: limit });
            interaction.editReply({ content: `Successfully setted maximum ticket limit to **${limit}** in the panel \`${data.name}\`` });
        } else {
            if (!ticketData || !ticketData.panel) return interaction.editReply({ content: "This is not a ticket channel." });

            let user = interaction.guild.members.cache.get(ticketData?.user);

            if (command === "close") {
                if (ticketData.closed) return interaction.editReply({ content: "This ticket is already closed" });
                interaction.channel.permissionOverwrites.create(user, {
                    VIEW_CHANNEL: false,
                    SEND_MESSAGES: false,
                });

                await ticket.findOneAndUpdate({ channel: interaction.channel.id }, { closed: true });

                interaction.editReply({ content: "This ticket is now closed" });

                interaction.guild.channels.cache.get(data.logs)?.send({
                    embeds: [{
                        title: "Ticket closed",
                        timestamps: Date.now(),
                        fields: [{
                            name: "Panel",
                            value: data.name,
                            inline: true
                        }, {
                            name: "User",
                            value: member.user.username,
                            inline: true
                        }, {
                            name: "Ticket",
                            value: interaction.channel.toString(),
                            inline: true
                        }, {
                            name: "\u200b",
                            value: "\u200b",
                            inline: true
                        }, {
                            name: "Moderator",
                            value: interaction.user.username,
                            inline: true
                        }]
                    }]
                })
            } else if (command === "re-open") {
                if (!ticketData.closed) return interaction.editReply({ content: "This ticket is not closed" });
                interaction.channel.permissionOverwrites.create(user, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                });

                await ticket.findOneAndUpdate({ channel: interaction.channel.id }, { closed: false });

                interaction.editReply({ content: "This ticket is now re-opened" });
                interaction.guild.channels.cache.get(data.logs)?.send({
                    embeds: [{
                        title: "Ticket re-opened",
                        timestamps: Date.now(),
                        fields: [{
                            name: "Panel",
                            value: data.name,
                            inline: true
                        }, {
                            name: "User",
                            value: member.user.username,
                            inline: true
                        }, {
                            name: "Ticket",
                            value: interaction.channel.toString(),
                            inline: true
                        }, {
                            name: "\u200b",
                            value: "\u200b",
                            inline: true
                        }, {
                            name: "Moderator",
                            value: interaction.user.username,
                            inline: true
                        }]
                    }]
                })
            } else if (command === "delete") {
                interaction.editReply({ content: "This ticket is closed and channel will be deleted in few seconds" });
                await ticket.findOneAndDelete({ channel: interaction.channel.id });
                await new Promise(res => setTimeout(res, 2000));

                interaction.channel.delete().catch(e => {
                    interaction.editReply({ content: "Ticket was deleted from database but i was unable to delete this channel" });
                })
                interaction.guild.channels.cache.get(data.logs)?.send({
                    embeds: [{
                        title: "Ticket deleted",
                        timestamps: Date.now(),
                        fields: [{
                            name: "Panel",
                            value: data.name,
                            inline: true
                        }, {
                            name: "User",
                            value: member.user.username,
                            inline: true
                        }, {
                            name: "Ticket",
                            value: interaction.channel.toString(),
                            inline: true
                        }, {
                            name: "\u200b",
                            value: "\u200b",
                            inline: true
                        }, {
                            name: "Moderator",
                            value: interaction.user.username,
                            inline: true
                        }]
                    }]
                })
            }
        }
    }
}