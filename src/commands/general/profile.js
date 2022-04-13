const { MessageAttachment } = require("discord.js");
const badge = require("../../models/badge")
const userConfig = require("../../models/userConfig");
const createProfile = require("../../utility/createProfile");

module.exports = {
    data: {
        name: "profile",
        description: "Check somebody's profile",
        options: [{
            type: 6,
            name: 'user',
            description: "The user who's profile you want to check"
        }],
    },
    timeout: 3000,

    run: async (client, interaction) => {
        await interaction.deferReply();

        const user = interaction.options.getUser("user") || interaction.user,
            u = await userConfig.findOne({ user: user.id }) || await userConfig.create({ user: user.id });

        let badges = [];

        for (let i = 0; i < u.badges.length; i++) {
            const bg = await badge.findOne({ id: u.badges[i] });

            if (!bg) continue;

            badges.push(client.emojis.cache.get(bg?.emoji)?.toString() || bg?.emoji);
        }

        interaction.editReply({
            embeds: [{
                title: `${user.username}'s profile`,
                image: {
                    url: 'attachment://profile.png'
                }
            }],
            files: [new MessageAttachment(await createProfile(user.username, user.displayAvatarURL({ format: 'png' }), badges ), "profile.png")]
        });
    }
}