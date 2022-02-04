const { MessageActionRow } = require('discord.js');

module.exports = {
    data: {
        name: "help",
        description: "Get some help ;D",
    },

    run: async (client, interaction) => {
        const row = new MessageActionRow(), options = client.categories.map(v => {
            return {
                label: `${v.replace(v.charAt(0), v.charAt(0).toUpperCase())}`,
                value: v
            }
        });

        let used = false;

        row.addComponents({
            type: "SELECT_MENU",
            customId: "select",
            placeholder: "Choose a category",
            options
        });

        const msg = await interaction.reply({
            fetchReply: true,
            components: [row],
            embeds: [{
                title: `${client.user.username}'s Help 📚 Menu`,
                description: `I am a simple tutorial bot, for my youtube channel's series on [discord bots](https://www.youtube.com/watch?v=En1rbbrar_Q&list=PLE7Nd_E0DDA837kBCGO4lqBW5ve-x_gk_)` +
                    `\nI have various cool features like\n- Reaction role\n- Ticket System\n- Simple Pokemon Game\n- Greetings\n- Tags\nAnd a lot more and guess what new things will be coming soon :D\n\nTo get list of commands of a category select the category from the select menu below`,
                color: "#f5a207"
            }]
        });

        // Select menu collector for category
        const col = msg.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 10000,
        });

        // Select menu collector for category
        col.on('collect', async (i) => {
            let cat = i.values[0], index = 0;
            used = true;

            row.components[0].options = client.commands.filter(v => v.category === cat).map(c => {
                let v = c.data.name

                return {
                    label: v.replace(v.charAt(0), v.charAt(0).toUpperCase()),
                    value: v
                }
            });
            row.components[0].placeholder = "Choose a command";

            const msg = await i.update({
                embeds: [{
                    title: `${cat.replace(cat.charAt(0), cat.charAt(0).toUpperCase())}'s commands list`,
                    description:
                        client.commands.filter(v => v.category === cat).map((v) => `\`${++index}.\`**${v.data.name}**\n${v.data.description}`).join("\n\n")
                }],
                components: [row],
                fetchReply: true
            });

            const col2 = msg.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 10000
            });

            col2.on('collect', (i) => {
                const command = client.commands.get(i.values[0]),
                    fields = command.data.options?.map(v => {
                        return {
                            name: v.name,
                            value: v.description
                        }
                    });

                i.update({
                    embeds: [{
                        title: `${command.data.name}'s detail`,
                        description: `${command.data.description}`,
                        fields
                    }],
                    components: []
                });

                col2.stop();
            });

            col2.on('end', (reason) => {
                if (reason === 'time') {
                    msg.edit({
                        components: []
                    })
                }
            })

            col.stop();
        });

        // Select menu collector for category end
        col.on('end', (reason) => {
            if (reason === 'time' && !used) {
                msg.edit({
                    components: []
                })
            }
        })
    }
}