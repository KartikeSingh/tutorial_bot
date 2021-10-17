const { ButtonInteraction } = require('discord.js');
const tickets = require('../models/tickets');
const ticket = require('../models/ticket');

/**
 * 
 * @param {*} client 
 * @param {ButtonInteraction} interaction 
 * @returns 
 */
module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const data = await tickets.findOne({ guild: interaction.guildId, message: interaction.message.id }), member = interaction.guild.members.cache.get(interaction.user.id);
    const ticketsLength = data.index;

    if (data.banned.some(v => member.roles.cache.has(v))) return interaction.reply({ content: "You are banned from this pannel", ephemeral: true });

    const overwrites = [{
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        type: "role"
    }, {
        id: interaction.user.id,
        allow: ["VIEW_CHANNEL"],
        type: "member"
    }];

    data.moderators.forEach(v => overwrites.push({ id: v, allow: ["VIEW_CHANNEL"], type: "role" }));

    const channel = await interaction.guild.channels.create(`ticket-${ticketsLength + 1}`, {
        reason: `Automatic ticket created for ${interaction.user.username}`,
        permissionOverwrites: overwrites,
        type: "GUILD_TEXT"
    });

    interaction.reply({ content: "ticket is created successfully", ephemeral: true });
    channel.send({ content: `${interaction.user.toString()}, stay patient staff will be arrivin soon!` });

    await tickets.findOneAndUpdate({ guild: interaction.guildId, message: interaction.message.id }, { $inc: { index: 1 } });
    await ticket.create({ channel: channel.id, guild: interaction.guildId, user: interaction.user.id, panel: data.name });
}