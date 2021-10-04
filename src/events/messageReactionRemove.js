const reactionRole = require("../models/reactionRole");

module.exports = async (client, reaction, user) => {
    const menu = await reactionRole.findOne({ message: reaction.message.id });

    if (!menu || menu.roles.length === 0 || !menu.roles.some(v => v.emoji === reaction.emoji.id || v.emoji === reaction.emoji.name)) return;

    const member = reaction.message.guild.members.cache.get(user.id);

    menu.roles.forEach(v => {
        const role  = reaction.message.guild.roles.cache.get(v.role);

        if ((v.emoji !== reaction.emoji.name && v.emoji !== reaction.emoji.id) || !member.roles.cache.has(role.id)) return;

        member.roles.remove(role).then(() => {
            user.send({ content: `I removed the **${role.name}** role from you in ${reaction.message.guild.name}` })
        }).catch(() => {
            user.send({ content: `I was unable to remove a role from you in ${reaction.message.guild.name}` })
        })

    })
}