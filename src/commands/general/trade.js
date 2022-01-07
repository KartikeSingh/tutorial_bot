const userConfig = require('../../models/userConfig');
const pokecord = require('pokecord');
const { ReactionCollector, MessageCollector } = require('discord.js');

module.exports = {
    data: {
        name: "trade",
        description: "Trade your pokemons",
        options: [{
            name: "user",
            description: "Mention a user to trade with",
            required: true,
            type: 6,
        }, {
            name: "item",
            description: "The item you want to trade, type -1 for nothing",
            required: true,
            type: 4,
        }],
    },

    run: async (client, interaction) => {
        await interaction.reply("Fetching the details");

        const u1_data = await userConfig.findOne({ user: interaction.user.id }) || await userConfig.create({ user: interaction.user.id }),
            user = interaction.options.getUser("user"),
            u2_data = await userConfig.findOne({ user: user.id }) || await userConfig.create({ user: user.id }),
            P1_id = interaction.options.getInteger("item");

        if (user.id === interaction.user.id || user.bot) return interaction.editReply("you can't trae with yourself or with a bot");

        if (P1_id !== -1 && !u1_data.pokemons[P1_id]) return interaction.editReply(`❌ Invalid Pokemon ID was provided`);

        let P1 = P1_id === -1 ? -1 : await pokecord.Spawn(u1_data.pokemons[P1_id]), P2, P2_id;

        const msg = await interaction.channel.send({
            embeds: [{
                title: "Trade Offer",
                description: `Hello ${user.username}, ${interaction.user.username} gave you a trade offer for a **${P1 === -1 ? "nothing" : P1.name}**, react with ✅ for continuing the trade or react with ❌ for rejecting the trade offer`
            }],
            content: `${user.toString()}`
        });

        await msg.react("✅");
        await msg.react("❌");

        const c = new ReactionCollector(msg, { time: 30000, filter: (r, u) => ["✅", "❌"].includes(r.emoji.name) && u.id === user.id });

        c.on('collect', (rec) => c.stop(rec.emoji.name));

        c.on('end', (shit, reason) => {
            if (reason === "time") {
                interaction.followUp("The mentioned user ignored the trade offer");
                msg.edit({
                    embeds: [{
                        title: "Trade Offer Expired",
                        color: "#ff0000",
                        descrption: `Trade offer from ${interaction.user.username} is expired`
                    }]
                })
            } else if (reason === "❌") {
                interaction.followUp("The mentioned user denied ❌ the trade offer");

                msg.edit({
                    embeds: [{
                        title: "Trade Offer Declined Successfully",
                        descrption: `Trade offer from ${interaction.user.username} is declined`
                    }]
                })
            } else {
                msg.edit({
                    embeds: [{
                        title: "Trade Offer Accepted Successfully",
                        description: `${user.toString()}, Now give the pokemon ID you want to trade or type \`-1\` for \`nothing\` or type \`cancel\` to cancel the trade`
                    }],
                });

                const col = new MessageCollector(msg.channel, { time: 120000, filter: (m) => m.author.id === user.id });

                col.on('collect', async (msg) => {
                    if (msg.content.toLowerCase() === "cancel") return col.stop("cancel");

                    P2_id = parseInt(msg.content);
                    if (isNaN(P2_id) || (!u2_data.pokemons[P2_id] && P2_id !== -1)) return msg.reply("Invalid pokemon ID was provided, provide a valid ID, or -1 for nothing or type `cancel` to cancel the trade");
                    P2 = P2_id=== -1 ? -1 : await pokecord.Spawn(u2_data.pokemons[msg.content]);

                    col.stop("done");
                });

                col.on('end', async (shit, reason) => {
                    if (reason === "time") {
                        interaction.followUp("The mentioned user took way too much time to respond so the trade is expired");
                        
                        msg.edit({
                            embeds: [{
                                title: "Trade Offer Expired",
                                color: "#ff0000",
                                descrption: `You took way too much time to respond`
                            }]
                        })
                    } else if (reason === "cancel") {
                        interaction.followUp("The mentioned user denied ❌ the trade offer");
                        
                        msg.edit({
                            embeds: [{
                                title: "Trade Offer Declined Successfully",
                                descrption: `Trade offer from ${interaction.user.username} is declined`
                            }]
                        })
                    } else {
                        const msg = await interaction.followUp(`The mentioned user offered  ${P2 === -1 ? "nothing" : P2.name}, do you want to confirm the trade, if yes react with ✅ else react with ❌`);
                        await msg.react("✅")
                        await msg.react("❌")

                        const c = new ReactionCollector(msg, { time: 30000, filter: (r, u) => ["✅", "❌"].includes(r.emoji.name) && u.id === interaction.user.id });
                        c.on('collect', (rec) => c.stop(rec.emoji.name));

                        c.on('end', async (rec) => {
                            if (reason === "time") {
                                interaction.followUp("You took way too much time to respond so the trade is expired");
                            } else if (reason === "❌") {
                                msg.edit({
                                    embeds: [{
                                        title: "Trade Offer was Declined",
                                        descrption: `Trade offer was declined by ${interaction.user.username}`
                                    }]
                                })
                            } else {
                                if (P1 !== -1) {
                                    u1_data.pokemons = u1_data.pokemons.filter((v, i) => i !== P1_id);
                                    u2_data.pokemons.push(P1.id)
                                }
                                if (P2 !== -1) {
                                    u2_data.pokemons = u2_data.pokemons.filter((v, i) => i !== P2_id);
                                    u1_data.pokemons.push(P2.id)
                                }

                                msg.channel.send({
                                    embeds: [{
                                        title: "Trade Ended Successfully",
                                        descrption: `
                                        ${interaction.user.username} got ${P2 === -1 ? "Nothing" : P2.name},\n
                                        ${user.username} got ${P1 === -1 ? "Nothing" : P1.name},
                                        `
                                    }]
                                })

                                await userConfig.findOneAndUpdate({ user: interaction.user.id }, { pokemons: u1_data.pokemons });
                                await userConfig.findOneAndUpdate({ user: user.id }, { pokemons: u2_data.pokemons });
                            }
                        })
                    }
                })
            }
        })
    }
}