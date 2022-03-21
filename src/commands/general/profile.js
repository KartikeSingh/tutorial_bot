const badge = require("../../models/badge")
const userConfig = require("../../models/userConfig")

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

        let str = "";

        for (let i = 0; i < u.badges.length; i++) {
            const bg = await badge.findOne({ id: u.badges[i] });
            
            if (!bg) continue;

            str += `${client.emojis.cache.get(bg?.emoji)?.toString() || bg?.emoji} **${bg?.name}**\n`
        }

        interaction.editReply({
            embeds: [{
                title: `${user.username}'s profile`,
                description: `${str?.length < 1 ? "This user do not have badges" : str}`
            }]
        });
    }
}