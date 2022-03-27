const froms = ["all", "human", "bot"];

module.exports = {
    data: {
        name: "roles",
        description: "Manage roles of the server",
        options: [{
            name: "action",
            type: 3,
            required: true,
            description: "Choose the action",
            choices: [{
                name: "Give Role",
                value: "1"
            }, {
                name: "Take Role",
                value: "2"
            }]
        }, {
            name: "from",
            description: "The category you want to manipulate, give role ID, or type human or bot or all",
            required: true,
            type: 3
        }, {
            name: "for",
            description: "This is the role you want to give or take",
            required: true,
            type: 8
        }],
    },
    timeout: 100000,
    permissions: ["ADMINISTRATOR"],

    run: async (client, interaction) => {
        const action = interaction.options.getString("action"),
            from = interaction.options.getString("from")?.toLowerCase(),
            _for = interaction.options.getRole("for");

        if (!froms.includes(from) && !interaction.guild.roles.cache.get(/\d+/.exec(from) + "")) return interaction.reply({
            embeds: [{
                title: "❌ Invalid from value",
                color: "RED",
                description: "It should be the role ID, against which you want to take the action\nOr you can type `huamn` for taking action against humans, `bot` for the bots and `all` for everyone"
            }]
        });

        if (_for.position > interaction.guild.me.roles.highest.position && !interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({
            embeds: [{
                title: "❌ Invalid Permissions",
                color: "RED",
                description: "Either I do not have Manage Role permission, or the provided role is above my highest role"
            }]
        });

        let filter, ind = froms.indexOf(from);

        if (ind === 0) filter = (m) => m.roles.cache.has(_for.id) === (action !== "1")
        else if (ind === 1) filter = (m) => !m.user.bot && m.roles.cache.has(_for.id) === (action !== "1")
        else if (ind === 2) filter = (m) => m.user.bot && m.roles.cache.has(_for.id) === (action !== "1")
        else filter = (m) => m.roles.cache.has(/\d+/.exec(from) + "") && m.roles.cache.has(_for.id) === (action !== "1");

        const members = (await interaction.guild.members.fetch({ force: true })).filter(filter)?.toJSON();

        await interaction.reply({
            embeds: [{
                color: "BLUE",
                title: `Changing roles for ${members.length} member`
            }]
        });


        for (let i = 0; i < members.length; i++) {
            await members[i].roles[action === "1" ? "add" : "remove"](_for);
        }

        interaction.editReply({
            embeds: [{
                color: "GREEN",
                title: "✅ Roles changed successfully"
            }]
        })
    }
}