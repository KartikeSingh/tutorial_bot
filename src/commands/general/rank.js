const users = require('../../models/user_xp');

module.exports = {
    data: {
        name: "rank",
        description: "Check your rank!",
        options: [{
            name: "user",
            description: "Mention a user",
            required: false,
            type: 6,
        }],
    },

    run: async (client, interaction) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const data = await users.findOne({ user: user.id, guild: interaction.guild.id }) || {};

        const em = {
            title: `${interaction.user.username}'s rank card`,
            fields: [
                { name: "XP", value: data.xp || 0 + ".", inline: true },
                { name: "Level", value: data.level || 0 + ".", inline: true },
            ]
        }
        console.log(JSON.stringify(em));
        interaction.reply({ content: `your level is ${data.level}, your xp is ${data.xp}` });
    }
}