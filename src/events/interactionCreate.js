module.exports = async (client, interaction) => {
    if (!interaction.isCommand() && !interaction.isContextMenu()  || !interaction.guild) return;

    try {
        const command = client.commands.get(interaction.commandName), member = interaction.guild.members.cache.get(interaction.member.id);

        if (!command || (!command.dm && !interaction.guild)) return;
        
        if (command.permissions?.length > 0 && !(command.permissions.some(v => member.permissions.has(v)))) return interaction.reply({ content: `You do not have any of the required permissions to use this command, required permissions : ${command.permissions.join(", ")}` })

        command.run(client, interaction);
    } catch (e) {
        console.log(e);
        interaction.reply({ content: "There was an issue in executing the command" });
    }
}