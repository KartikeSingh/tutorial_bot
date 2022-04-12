const polls = require("../models/polls");

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const pol = await polls.findOne({ message: interaction.message.id });

    if (!pol) return;

    await interaction.deferReply({
        ephemeral: true
    });

    if (pol.voters.includes(interaction.user.id)) return interaction.editReply({
        embeds: [{
            color: "RED",
            title: "❌ Already Voted!"
        }]
    });

    pol.votes = pol.votes || {};

    if (pol.votes[interaction.customId]) pol.votes[interaction.customId] += 1
    else pol.votes[interaction.customId] = 1;

    pol.voters.push(interaction.user.id);

    await polls.findOneAndUpdate({ message: pol.message }, pol);

    interaction.editReply({
        embeds: [{
            color: "GREEN",
            title: "✅ Voted Successfully"
        }]
    });

    const m = interaction.message;

    m.edit({
        components: m.components.map(row => {
            row.components = row.components?.map(v => {
                v.label = `${pol.votes[v.customId] || 0}`;

                return v;
            });

            return row;
        })
    })
}