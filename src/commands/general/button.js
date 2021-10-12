const { MessageButton, MessageActionRow, CommandInteraction, MessageComponentInteraction, InteractionCollector, MessageCollector } = require('discord.js');

module.exports = {
    data: {
        name: "button",
        description: "Get some buttons!",
        options: [],
    },

    /**
     * 
     * @param {*} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const row = new MessageActionRow().addComponents(
            new MessageButton().setStyle("LINK").setURL("https://google.com").setLabel("Google").setEmoji("883586635470606356").setDisabled(true),
            new MessageButton().setStyle("DANGER").setLabel("Danger Zone").setCustomId("1"),
            new MessageButton().setStyle("SECONDARY").setLabel("Secondayr").setCustomId("2"),
            new MessageButton().setStyle("PRIMARY").setLabel("Primary").setCustomId("3"),
            new MessageButton().setStyle("SUCCESS").setLabel("Success").setCustomId("4"),
        );


        await interaction.reply({ components: [row], content: "Buttons!" });
        const msg = await interaction.fetchReply();

        const collector = msg.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id && parseInt(i.customId), time: 5000 })

        collector.on('collect', (int) => collector.stop(int.customId));

        collector.on('end', (ints, reason) => {
            let content = "";

            if (reason === "time") content = "You are way too slow to click on button you NERD";
            else if (reason === "1") content = "You clicked on the danger button";
            else if (reason === "2") content = "You clicked on the secondary button";
            else if (reason === "3") content = "You clicked on the primary button";
            else if (reason === "4") content = "You clicked on the success button";
            else content = "You click on a unknown button";

            interaction.editReply({ components: [], content });
        })
    }
}