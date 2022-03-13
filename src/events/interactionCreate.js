const ms = require('ms-prettify').default;

module.exports = async (client, interaction) => {
    try {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName), member = interaction.guild.members.cache.get(interaction.member.id);

        if (!command || (!command.dm && !interaction.guild)) return;

        if (command.permissions?.length > 0 && !(command.permissions.some(v => member.permissions.has(v)))) return interaction.reply({ content: `You do not have any of the required permissions to use this command, required permissions : ${command.permissions.join(", ")}` })

        const t = client.timeouts.get(`${interaction.user.id}_${command.name}`) || 0;

        if (Date.now() - t < 0) return interaction.reply({ content: `You are on a timeout of ${ms(t - Date.now(), { till: 'second' })}` });

        client.timeouts.set(`${interaction.user.id}_${command.name}`, Date.now() + (command.timeout || 0));

        command.run(client, interaction);
    } catch (e) {
        console.log(e);
        interaction.reply({ content: "There was an issue in executing the command" });
    }
}