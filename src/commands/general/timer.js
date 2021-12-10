const ms = require('ms-prettify').default;
const timers = require('../../models/timer');
const createID = require('../../utility/randomId');
const startTimer = require('../../utility/startTimer');

module.exports = {
    data: {
        name: "timer",
        description: "Set some kind of timer?",
        options: [{
            name: "time",
            description: "Time for this timer, like 10 min 23 sec",
            required: true,
            type: 3,
        }, {
            name: "reason",
            description: "Reason for this timeout, no?",
            required: false,
            type: 3,
        }],
    },

    run: async (client, interaction) => {
        const time = ms(interaction.options.getString("time")),
            reason = interaction.options.getString("reason") || "";

        if (!time) return interaction.reply("Invalid time was provided");

        const timer = await timers.create({ id: createID(), user: interaction.user.id, guild: interaction.guild.id, channel: interaction.channel.id, reason, createdAt: Date.now(), time, endAt: Date.now() + time });

        interaction.reply({ content: "Your timer ⏰ is started!" });

        startTimer(client, timer)
    }
}