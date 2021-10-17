const panels = require('../../models/tickets');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ticket = require('../../models/ticket');

module.exports = {
    data: {
        name: "ticket",
        description: "Configure the tickets for your server",
        options: [{
            name: "create",
            type: 1,
            description: "Create a ticket panel for your server",
            options: [{
                name: "panel-name",
                description: "The name for the panel",
                type: 3,
                required: true
            }]
        }, {
            name: "remove",
            type: 1,
            description: "remove a ticket panel for your server",
            options: [{
                name: "panel-name",
                description: "The name of the panel you wanna delete",
                type: 3,
                required: true
            }]
        }, {
            name: "start",
            type: 1,
            description: "Start a ticket panel for your server",
            options: [{
                name: "panel-name",
                description: "The name of the panel you wanna start",
                type: 3,
                required: true
            }, {
                name: "channel",
                description: "The channel where you want to start the panel",
                type: 7,
                required: true
            }]
        }, {
            name: "re-open",
            type: 1,
            description: "Open a closed ticket of your server, use command in ticket channel.",
            options:[]
        }, {
            name: "close",
            type: 1,
            description: "Close a active ticket of your server, use command in ticket channel.",
            options:[]
        }, {
            name: "delete",
            type: 1,
            description: "delete a active or closed ticket of your server, use command in ticket channel.",
            options:[]
        }]
    },
    permissions: ["MANAGE_SERVER", "MANAGE_CHANNELS"],

    run: async (client, interaction) => {
        await interaction.deferReply();

        const command = interaction.options.getSubcommand(), name = interaction.options.getString("panel-name"), channel = interaction.options.getChannel("channel");
        let data = await panels.findOne({ guild: interaction.guildId, name });

        if (command === "create") {
            if (data) return interaction.editReply({ content: `Panel already exist with the name \`${name}\`` });
            data = await panels.create({ name, guild: interaction.guildId });

            interaction.editReply({ content: `Successfully create a panel with name \`${name}\`` });
        } else if (command === "remove") {
            if (!data) return interaction.editReply({ content: `Panel do not exist with the name \`${name}\`` });
            data = await panels.findOneAndDelete({ name, guild: interaction.guildId });

            interaction.editReply({ content: `Successfully deleted the panel with name \`${name}\`` });
        } else if (command === "start") {
            if (!data) return interaction.editReply({ content: `Panel do not exist with the name \`${name}\`` });
            if (channel.type !== "GUILD_TEXT") return interaction.editReply({ content: `The provided channel should be a text channel` });

            const embed = new MessageEmbed().setTitle(`Panel : ${name}`).setDescription("Click on 📩 to create a ticket");
            const row = new MessageActionRow().addComponents(new MessageButton().setCustomId("ticket_button").setLabel("Create Ticket").setEmoji("📩").setStyle("PRIMARY"));

            channel.send({ embeds: [embed], components: [row] })
                .then(async (v) => {
                    data = await panels.findOneAndUpdate({ guild: interaction.guildId, name }, { message: v.id });
                    interaction.editReply({ content: `Successfully started the panel with name \`${name}\` in ${channel.toString()}` })
                })
                .catch(() => interaction.editReply({ content: `I was unable started the panel with name \`${name}\` in ${channel.toString()}, probably I do not have permission to send message / embed links in that channel` }));
        } else {
            let ticketData = await ticket.findOne({ channel: interaction.channel.id });

            if (!ticketData) return interaction.editReply({ content: "This channel is not a ticket" });
            const user = interaction.guild.members.cache.get(ticketData.user)
            
            if (command === "close") {
                if (ticketData.closed) return interaction.editReply({ content: "This ticket is already closed" });
                interaction.channel.permissionOverwrites.create(user, {
                    VIEW_CHANNEL: false,
                    SEND_MESSAGES: false,
                });

                ticketData = await ticket.findOneAndUpdate({ channel: interaction.channel.id }, { closed: true });

                interaction.editReply({ content: "This ticket is now closed" });
            } else if (command === "re-open") {
                if (!ticketData.closed) return interaction.editReply({ content: "This ticket is not closed" });
                interaction.channel.permissionOverwrites.create(user, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                });

                ticketData = await ticket.findOneAndUpdate({ channel: interaction.channel.id }, { closed: false });
           
                interaction.editReply({ content: "This ticket is now re opened" });
            } else if (command === "delete") {
                interaction.editReply({ content: "This ticket is deleted, channel will be deleted in couple of seconds" });

                ticketData = await ticket.findOneAndDelete({ channel: interaction.channel.id }, { closed: false });
                await new Promise(res => setTimeout(res, Math.random() * 2000 + 800));
                interaction.channel.delete().catch(e => interaction.followUp("I do not have permissions to delete the channel"))
            }
        }
    }

}