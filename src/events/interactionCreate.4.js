const suggestion = require("../models/suggestion");

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const sug = await suggestion.findOne({ message: interaction.message?.id });

    if (!sug) return;
    await interaction.deferReply({ ephemeral: true });

    if (sug.votes.up.includes(interaction.user.id) || sug.votes.down.includes(interaction.user.id)) return interaction.editReply({
        embeds: [{
            color: "RED",
            title: "❌ Already voted"
        }]
    });

    sug.votes[interaction.customId === "1" ? "up" : "down"]?.push(interaction.user.id);
    await suggestion.findOneAndUpdate({ message: sug.message }, sug);

    interaction.editReply({
        embeds: [{
            color: "GREEN",
            title: "✅ Voted Successfully"
        }]
    });
    const msg = await interaction.channel.messages.fetch(sug.message);

    if (!msg) return;

    msg.embeds[0].fields[0].value = (sug.votes.up.length - 1).toString();
    msg.embeds[0].fields[1].value = (sug.votes.down.length - 1  ).toString();

    msg?.edit({
        embeds: msg.embeds
    })
}