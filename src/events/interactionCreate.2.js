const reactionRole = require("../models/reactionRole");

module.exports = async (client, interaction) => {
    if (!interaction.isButton()  || !interaction.guild) return;

    const emoji = interaction?.component?.emoji;

    const menu = await reactionRole.findOne({ message: interaction.message.id });

    if (!menu || menu.roles.length === 0 || !menu.roles.some(v => v.emoji === emoji.id || v.emoji === emoji.name)) return;

    const member = interaction.guild.members.cache.get(interaction.user.id);

    menu.roles.forEach(v => {
        const role = interaction.guild.roles.cache.get(v.role);

        if ((v.emoji !== emoji.name && v.emoji !== emoji.id)) return;

        if (!member.roles.cache.has(role.id)) {
            member.roles.add(role).then(() => {
                interaction.reply({ content: `I gave you the **${role.name}** role in ${interaction.guild.name}`, ephemeral: true })
            }).catch(() => {
                interaction.reply({ content: `I was unable to give you the role in ${interaction.guild.name}`, ephemeral: true })
            })
        } else {
            member.roles.remove(role).then(() => {
                interaction.reply({ content: `I removed the **${role.name}** role from you in ${interaction.guild.name}`, ephemeral: true })
            }).catch(() => {
                interaction.reply({ content: `I was unable to remove a role from you in ${interaction.guild.name}`, ephemeral: true })
            })
        }
    })
}