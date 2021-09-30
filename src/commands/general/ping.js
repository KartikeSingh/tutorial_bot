module.exports = {
    data: {
        name: "ping",
        description: "Get this bot's ping!",
        options: [],
    },

    run: async (client, interaction) => {
        interaction.reply({ content: `THe ping of the client is ${client.ws.ping}` })
    }
}