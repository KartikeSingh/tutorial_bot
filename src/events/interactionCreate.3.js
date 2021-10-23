const tickets = require('../models/tickets');
const ticket = require('../models/ticket');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const data = await tickets.findOne({ guild: interaction.guildId, message: interaction.message.id }),
        member = interaction.guild.members.cache.get(interaction.user.id);

    if (!data) return;

    if (data.banned.some(v => member.roles.cache.has(v))) return interaction.reply({ content: "You are banned from the panel" });


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

    const channel = await interaction.guild.channels.create(`ticket-${data.index + 1}`, {
        reason: "for ticket system",
        type: "GUILD_TEXT",
        permissionOverwrites: overwrites
    });

    interaction.reply({ content: "ticket is created successfully", ephemeral: true });
    channel.send({ content: `${interaction.user.toString()}, stay patient staff will be arving soon.` });

    await tickets.findOneAndUpdate({ guild: interaction.guildId, message: interaction.message.id }, { $inc: { index: 1 } });
    await ticket.create({ channel: channel.id, guild: interaction.guildId, user: interaction.user.id, panel: data.panel });
}