const guildConfigs = require('../models/guildConfig');
const users = require('../models/user_xp');

module.exports = async (client, message) => {
    const data = await guildConfigs.findOne({ id: message.guild.id }) || {};

    if (!data.xp || data?.ignoreXP?.includes(message.channel.id) || message.author.bot) return;

    const userData = await users.findOne({ user: message.author.id, guild: message.guild.id }) || await users.create({ user: message.author.id, guild: message.guild.id });

    if (userData.lastXP + (data.xpTimeout || 1000) > Date.now()) return;
    let xp = (Math.floor(Math.random() * (data.xpLimit.up - data.xpLimit.down)) + data.xpLimit.down) * data.xpRate, reqXP = 100;
    userData.xp += xp;

    for (let i = 1; i <= userData.level; i++)reqXP += 5 * (i ^ 2) + (50 * i) + 100;

    if (userData.xp >= reqXP) {
        userData.level += 1;
        if (!data.xpLevelUp.enable) return;
        let channel = message.guild.channels.cache.get(data.xpLevelUp.channel) || message.channel;

        channel.send({ content: data.xpLevelUp.message.replace(/{mention}/g, message.author.toString()).replace(/{level}/, userData.level).replace(/{xp}/, userData.xp) });
    }

    await users.findOneAndUpdate({ user: message.author.id, guild: message.guild.id }, {
        xp: userData.xp,
        level: userData.level,
        lastXP: Date.now()
    });
}