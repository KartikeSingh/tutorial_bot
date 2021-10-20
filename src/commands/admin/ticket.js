const tickets = require('../../models/tickets');
const ticket = require('../../models/ticket');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

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
        }]
    },
    permissions: ["MANAGA_SERVER", "MANAGE_CHANNELS"],

    run: async (client, interaction) => {
        await interaction.deferReply();

        const command = interaction.options.getSubcommand(), name = interaction.options.getString("panel-name"), channel = interaction.options.getChannel("channel"),
            data = await tickets.findOne({ guild: interaction.guildId, name });

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
                await tickets.findOneAndUpdate({ guild: interaction.guildId, name }, { message: v.id });
                interaction.editReply({ content: `Successfully started the panel with name : \`${name}\` in ${channel.toString()}` })
            }).catch(e => {
                interaction.editReply({ content: `Unable to send the message in ${channel.toString()}` })
            })
        } else {
            const ticketData = await ticket.findOne({ channel: interaction.channel.id });

            if (!ticketData) return interaction.editReply({ content: "This is not a ticket channel." });
            const user = interaction.guild.members.cache.get(ticketData.user);

            if (command === "close") {
                if (ticketData.closed) return interaction.editReply({ content: "This ticket is already closed" });
                interaction.channel.permissionOverwrites.create(user, {
                    VIEW_CHANNEL: false,
                    SEND_MESSAGES: false,
                });

                await ticket.findOneAndUpdate({ channel: interaction.channel.id }, { closed: true });

                interaction.editReply({ content: "This ticket is now closed" });
            } else if (command === "re-open") {
                if (!ticketData.closed) return interaction.editReply({ content: "This ticket is not closed" });
                interaction.channel.permissionOverwrites.create(user, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                });

                await ticket.findOneAndUpdate({ channel: interaction.channel.id }, { closed: false });

                interaction.editReply({ content: "This ticket is now re-opened" });
            } else if (command === "delete") {
                interaction.editReply({ content: "This ticket is closed and channel will be deleted in few seconds" });
                await ticket.findOneAndDelete({ channel: interaction.channel.id });
                await new Promise(res => setTimeout(res, 2000));

                interaction.channel.delete().catch(e => {
                    interaction.editReply({ content: "Ticket was deleted from database but i was unable to delete this channel" });
                })
            }
        }
    }
}