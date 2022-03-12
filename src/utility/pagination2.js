const { MessageSelectMenu, MessageActionRow } = require("discord.js");

module.exports = async (interaction, pages, options, time = 60000, placeholder = "Select a Page") => {
    if (!interaction || !Array.isArray(pages) || !Array.isArray(options) || pages.length < 1 || pages.length !== options.length, typeof (time) !== 'number' || typeof (placeholder) !== "string") throw Error('Invalid Parameters');

    const menu = new MessageSelectMenu({
        customId: 'menu_1',
        placeholder,
        options: options.map((v, i) => {
            v.value = i.toString();
            v.default = i === 0;

            return v;
        })
    });

    let index = 0;

    const data = {
        fetchReply: true,
        components: [new MessageActionRow().addComponents(menu)],
        embeds: [pages[index]]
    },
        msg = interaction.replied ? await interaction.followUp(data) : await interaction.reply(data);

    const col = msg.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time
    });

    col.on('collect', async (i) => {
        index = parseInt(i.values[0]);

        menu.options = menu.options.map(v => {
            v.default = v.value === index.toString();

            return v;
        })

        i.update({
            embeds: [pages[index]],
            components: [new MessageActionRow().addComponents(menu)]
        })
    });

    col.on('end', () => {
        msg.edit({
            components: []
        })
    })
}