module.exports = (client, interaction) => {
    if (!interaction.isCommand()) return;

    try {
        client.commands.get(interaction.commandName)?.run(client, interaction);
    } catch (e) {
        console.log(e);
        interaction.reply({ content: "There was an issue in executing the command" });
    }
}