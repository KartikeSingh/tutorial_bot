const guildConfig = require('../models/guildConfig');
const canvacord = require('canvacord');

module.exports = async (client, member) => {
    const data = await guildConfig.findOne({ id: member.guild.id }),
        channel = member.guild.channels.cache.get(data?.welcome.channel);

    if (!channel || data?.welcome.enable !== true) return;

    const welcomeImage = new canvacord.Welcomer()
        .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "png" }))
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)
        .setGuildName(member.guild.name)
        .setMemberCount(member.guild.memberCount + 1)
        .setBackground("https://cdn.discordapp.com/attachments/714747037983309866/909416865539969065/2Q.png"),

        content = data.welcome.message
            .replace(/\{mention\}/g, member.user.toString())
            .replace(/\{user\}/g, member.user.username)
            .replace(/\{server\}/g, member.guild.name)
            .replace(/\{members\}/g, member.guild.memberCount + 1)

    channel.send({
        content,
        files: [await welcomeImage.build()]
    })
}