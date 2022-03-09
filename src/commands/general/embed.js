const { MessageEmbed, MessageAttachment, CommandInteraction } = require('discord.js');

module.exports = {
    data: {
        name: "embed",
        description: "Get some random embeds",
        options: [],
    },

    /**
     * 
     * @param {*} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const embed2 = new MessageEmbed()
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL(), "https://www.google.com")
            .setTitle("Hello this a a cool title")
            .setURL("https://studio.youtube.com/channel/UCSqcbw8r8TZKYUhx4mufvNg")
            .setDescription(`Hello this a description, for a youtube tutorial of [Krazy Developer](https://www.fiverr.com/kartikethehuman?up_rollout=true)`)
            .setThumbnail("https://cdn.discordapp.com/attachments/723104565708324915/948955281495302174/board.png")
            .setImage("attachment://e.jpg")
            .setColor("GOLD")
            .setFooter(`Command User: ${interaction.user.username}`, "https://wallpaperaccess.com/full/3458163.jpg")
            .addField("Test", "hello world")
            .addFields([
                { name: "COol field 1", value: "Trying to be better everyday!", inline: true },
                { name: "COol field 2", value: "Trying to be better everyday!", inline: true },
                { name: "COol field 3", value: "Trying to be better everyday!", inline: false },
            ])
            .setTimestamp()


        interaction.reply({
            embeds: [{
                author: {
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL(),
                    url: "https://www.google.com"
                },
                title: "Hello It is a better title",
                url: "https://studio.youtube.com/channel/UCSqcbw8r8TZKYUhx4mufvNg",
                description: "Hello this a description, for a youtube tutorial of [Krazy Developer](https://www.fiverr.com/kartikethehuman?up_rollout=true)",
                thumbnail: {
                    url: 'attachment://e.jpg'
                }, image: {
                    url: 'attachment://e.jpg'
                },
                color: "DARK_ORANGE",
                footer: {
                    text: "This is the footer bro",
                    iconURL: "https://wallpaperaccess.com/full/3458163.jpg"
                },
                fields: [
                    { name: "COol field 1", value: "Trying to be better everyday!", inline: true },
                    { name: "COol field 2", value: "Trying to be better everyday!", inline: true },
                    { name: "COol field 3", value: "Trying to be better everyday!", inline: false },
                    { name: "COol field 4", value: "Trying to be better everyday!", inline: true },
                    { name: "COol field 5", value: "Trying to be better everyday!", inline: true },

                ],timestamp:Date.now(),
            }],
            files: [new MessageAttachment('./e.jpg')]
        })
    }
}