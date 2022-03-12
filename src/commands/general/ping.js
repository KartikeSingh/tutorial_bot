module.exports = {
    data: {
        name: "ping",
        description: "Get this bot's ping!",
        options: [],
    },
    timeout:10000,

    run: async (client, interaction) => {
        interaction.reply({ content: `THe ping of the client is ${client.ws.ping}` })
    }
}