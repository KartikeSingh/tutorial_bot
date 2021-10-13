const {  Interaction } = require("discord.js");

module.exports = {
    data: {
        name: "say-hello",
        description: "",
        type: 2,
    },
    permissions: ["MANAGE_SERVER"],

    /**
     * 
     * @param {*} client 
     * @param {Interaction} interaction 
     */
    run: async (client, interaction) => {
        const member = interaction.guild.members.cache.get(interaction.targetId);

        member.user.send({ content: `Hello from ${interaction.user.toString()}` }).then(v => {
            interaction.reply({ content: `Successfuly greeted ${member.user.toString()}`, ephermal: true });
        }).catch(e => {
            interaction.reply({ content: `Unable to greete ${member.user.toString()}`, ephermal: true });

        })
    }
}