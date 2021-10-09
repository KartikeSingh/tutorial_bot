const { Client, Message } = require("discord.js");

module.exports = {
    data: {
        name: "poke",
        description: "", // it should be empty
        type: 3,
    },

    /**
     * 
     * @param {Client} client 
     * @param {*} interaction 
     */
    run: async (client, interaction) => {
        const message = await client.channels.cache.get(interaction.channelId).messages.fetch(interaction.targetId, true);

        interaction.reply({ content: `${interaction.user.toString()} poked ${message.author.toString()}` })
    }
}