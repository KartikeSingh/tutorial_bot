const rps = require('discord-rock-paper-scissor');
const game = new rps({
    readyMessage: "Nerds choose your moves in the DMs",
    endTitle: "{winner} won the dang game",
    endDescription: "{winner} is the winner\n{looser} is the looser",
});

module.exports = {
    data: {
        name: "rock-paper-scissor",
        description: "Play rock paper scissor game",
        options: [{
            name: "user",
            description: "Mention a user",
            required: false,
            type: 6,
        }],
    },

    run: async (client, interaction) => {
        interaction.reply({ content: `The game is started` });
        const user = interaction.options.getUser("user");

        if (user && user.bot) return interaction.editReply({ content: "You can not play the game with bots" })

        if (!user) game.solo(interaction, client)
        else game.duo(interaction, user);
    }
}