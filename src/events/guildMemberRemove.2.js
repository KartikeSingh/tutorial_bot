const { MessageAttachment } = require('discord.js');

const guildConfig = require('../models/guildConfig');
const createLeave = require('../utility/createLeave');

module.exports = async (client, member) => {
    const data = await guildConfig.findOne({ id: member.guild.id }),
        channel = member.guild.channels.cache.get(data?.leave.channel);

    if (!channel || !data?.leave.enable) return;

    const a = new MessageAttachment(await createLeave(member), "leave.png")

    channel.send({
        files: [a],
        embeds: [{
            description: data.leave.message.replace(/{user}/g, member.user.username).replace(/{members}/g, member.guild.memberCount).replace(/{mention}/g, member.user.username).replace(/{guild}/g, member.guild.name),
            image: {
                url: "attachment://leave.png"
            }
        }]
    })
}