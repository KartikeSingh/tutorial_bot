const guildConfigs = require('../models/guildConfig');

module.exports = async (client, message) => {
    if (message.author.bot) return;

    const data = await guildConfigs.findOne({ id: message.guild.id }) || {};

    if (!data?.tags?.length > 0) return;
    data.tags?.forEach(tag => {
        const content = tag.case ? message.content : message.content.toLowerCase(),
            name = tag.case ? tag.name : tag.name.toLowerCase();

        if (!(tag.include ? content.includes(name + " ") || content.endsWith(" " + name) : content === name)) return;

        const res = tag.response.replace(/{mention}/g, message.author.toString()).replace(/{user}/g, message.author.username).replace(/{server}/g, message.guild.name)

        let msg = tag.embed ? {
            embeds: [{
                description: res
            }]
        } : {
            content: res
        };

        message.reply(msg);
    })
}