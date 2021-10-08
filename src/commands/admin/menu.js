const { MessageActionRow, MessageButton } = require('discord.js');
const menus = require('../../models/reactionRole');

module.exports = {
    data: {
        name: "menu",
        description: "Manage guild reaction role",
        options: [{
            name: "create",
            type: 1,
            description: "Create a new role menu",
            options: [{
                name: "name",
                description: "Name of the role menu",
                type: 3,
                required: true,
            }]
        }, {
            name: "delete",
            type: 1,
            description: "Delete a new role menu",
            options: [{
                name: "name",
                description: "Name of the role menu",
                type: 3,
                required: true,
            }]
        }, {
            name: "start",
            type: 1,
            description: "Start a new role menu",
            options: [{
                name: "name",
                description: "Name of the role menu",
                type: 3,
                required: true,
            }, {
                name: "channel",
                description: "Mention the channel",
                type: 7,
                required: true,
            }]
        }, {
            type: 1,
            name: "add-role",
            description: "Add a role in a reaction role menu",
            options: [{
                name: "name",
                description: "Name of the role menu",
                type: 3,
                required: true,
            }, {
                name: "role",
                description: "Mention the role",
                type: 8,
                required: true,
            }]
        }, {
            type: 1,
            name: "remove-role",
            description: "Remove a role from a reaction role menu",
            options: [{
                name: "name",
                description: "Name of the role menu",
                type: 3,
                required: true,
            }, {
                name: "role",
                description: "Mention the role",
                type: 8,
                required: true,
            }]
        }]
    },
    permissions: ["MANAGE_SERVER", "MANAGE_ROLES"],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.reply({ content: `${client.user.username} is thinking...` });

        const option = interaction.options.getSubcommand(true).toLowerCase();
        const name = interaction.options.getString("name")?.toLowerCase()?.trim();
        const menu = await menus.findOne({ name, guild: interaction.guildId });
        const my_role = interaction.guild.me.roles.highest.position;
        const role = interaction.options.getRole("role");
        const channel = interaction.options.getChannel("channel");

        if (option === "create") {
            if (menu) return interaction.editReply({ content: `Reaction Role menu already exists with that name, so next time use a different name.` });

            await menus.create({ guild: interaction.guildId, name, message: "0" });

            interaction.editReply({ content: `Role menu is created with name : \`${name}\`.` });
        } else if (option === "delete") {
            if (!menu) return interaction.editReply({ content: `Reaction Role menu do not exists with that name, so next time use a actual menu name.` });

            await menus.findOneAndDelete({ guild: interaction.guildId, name });

            interaction.editReply({ content: `Role menu is delete with name : \`${name}\`.` });
        } else if (option === "start") {
            if (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS") return interaction.editReply({ content: "Invalid channel was provided" });
            if (menu.roles.length === 0) return interaction.editReply({ content: "This menu have 0 roles." });

            let content = `Reaction Menu : **${menu.name}**\n\nReact to get yourself a role\n\n`,
                rows = [new MessageActionRow()], index;

            menu.roles.forEach((v, i) => {
                content += `> ${interaction.guild.emojis.cache.get(v.emoji)?.toString() || v.emoji} : \`${interaction.guild.roles.cache.get(v.role).name}\`\n\n`

                index = parseInt(i / 5);
                const button = new MessageButton({
                    customId: `reaction_role_${i}`,
                    style: "PRIMARY",
                    emoji: v.emoji,
                });

                rows[index] ? rows[index].addComponents(button) : rows[index] = new MessageActionRow().addComponents(button)
            })

            const msg = await channel.send({ content, components: rows });

            await menus.findOneAndUpdate({ name, guild: interaction.guildId }, { message: msg.id });

            interaction.editReply({ content: "Menu is started successfully" });
        } else if (option === "add-role") {
            if (!menu) return interaction.editReply({ content: `Reaction Role menu do not exists with that name, so next time give a real menu name.` });

            if (role.position >= my_role) return interaction.editReply({ content: `The provided role is above my highest role, so please put my role above it than try again.` });

            const msg = await interaction.channel.send({ content: `React with the emoji you want for this role` });

            const reactions = await msg.awaitReactions({
                errors: ["time"],
                filter: (r, u) => u.id === interaction.user.id,
                max: 1,
                time: 300000
            }).catch(e => { })

            const emoji = reactions.first()?.emoji;

            if (!emoji) return interaction.editReply({ content: "You took too much time to respond" });

            if (menu.roles.some(v => v.role === role.id) || menu.roles.some(v => v.emoji === emoji.id || v.emoji === emoji.name)) return interaction.editReply({ content: `Reaction Role menu already have either the provided role or the emoji` });

            menu.roles.push({ role: role.id, emoji: emoji.id || emoji.name });

            await menus.findOneAndUpdate({ name, guild: interaction.guildId }, { roles: menu.roles });

            interaction.editReply({ content: `Added role \`${role.name}\` with emoji : ${emoji.toString()} for menu : \`${menu.name}\`` });
            await msg.delete();
        } else if(option=== "remove-role") {
            if (!menu) return interaction.editReply({ content: `Reaction Role menu do not exists with that name, so next time give a real menu name.` });

            if (!menu.roles.some(v => v.role === role.id)) return interaction.editReply({ content: `Reaction Role menu do not have this role as its part` });

            menu.roles = menu.roles.filter((v) => v.role !== role.id);

            await menus.findOneAndUpdate({ name, guild: interaction.guildId }, { roles: menu.roles });

            interaction.editReply({ content: `Remove role \`${role.name}\`from menu : \`${menu.name}\`` });
        }
    }
}