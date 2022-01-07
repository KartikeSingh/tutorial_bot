const userConfig = require('../../models/userConfig');
const pokecord = require('pokecord');

module.exports = {
    data: {
        name: "pokemons",
        description: "Get list of pokemons your pokemons or someone else's",
        options: [{
            name: "user",
            description: "Mention a user to get their pokemons",
            required: false,
            type: 6,
        }],
    },

    run: async (client, interaction) => {
        await interaction.deferReply();
        
        const user = interaction.options.getUser("user") || interaction.user;
        const data = await userConfig.findOne({ user: user.id }) || await userConfig.create({ user: user.id });
        let pokemons = "ID\tPokemon";

        for (let i = 0; i < data.pokemons.length; i++) {
            const v = data.pokemons[i];
            pokemons += `${i}. ${(await pokecord.Spawn(v)).name}\n`
        }

        interaction.editReply({
            embeds: [{
                title: `${user.username}'s Pokemon's`,
                description: pokemons
            }]
        })
    }
}