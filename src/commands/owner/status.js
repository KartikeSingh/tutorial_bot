const { Client } = require("discord.js");

module.exports = {
    data: {
        name: "status",
        description: "Change the status of your client!",
        options: [{
            name: "status",
            description: "the new status of your client!",
            required: true,
            type: "STRING",
        }],
    },

    /**
     * 
     * @param {Client} client 
     * @param {*} interaction 
     * @returns 
     */
    run: async (client, interaction,args) => {
        if (!client.owners.includes(interaction.user.id)) return interaction.reply({ content: `You are not a owner` });

        client.user.setActivity({
            name: interaction.options.getString("status", true),
            type: "PLAYING"
        });

        interaction.reply({ content: `Status changed to  : ${interaction.options.getString("status")}` });
    }
}