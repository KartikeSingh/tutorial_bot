const { GuildMember } = require('discord.js');
const stats = require('../models/guildStats');

/**
 * 
 * @param {*} client 
 * @param {GuildMember} member 
 * @returns 
 */
module.exports = async (client, member) => {
    const data = await stats.findOne({ guild: member.guild.id });

    if (!data || !data.members || data.members === "0") return;

    const channel = member.guild.channels.cache.get(data.members);

    if (!channel || !channel.manageable) return;

    channel.setName(`Members : ${member.guild.memberCount}`);
}