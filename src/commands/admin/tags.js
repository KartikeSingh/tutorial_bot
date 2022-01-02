const configs = require('../../models/guildConfig');

module.exports = {
    data: {
        name: "tags",
        description: "Configure the tags of your server",
        options: [{
            name: 'add',
            description: "Add a tag",
            type: 1,
            options: [{
                name: "name",
                description: "The name of the tag",
                type: 3,
                required: true
            }, {
                name: "response",
                description: "The response for this tag",
                type: 3,
                required: true
            }, {
                name: "case",
                description: "Whether the tag is case sensitive or not",
                type: 5,
                required: false
            }, {
                name: "include",
                description: "Whether the tag should be triggered when it is incldued in the message",
                type: 5,
                required: false
            }, {
                name: "embed",
                description: "Whether the response should be a embed",
                type: 5,
                required: false
            }]
        }, {
            name: 'remove',
            type: 1,
            description: "Remove a tag",
            options: [{
                name: "name",
                description: "The name of the tag",
                type: 3,
                required: true
            }]
        }, {
            name: 'edit',
            description: "Edit a tag",
            type: 1,
            options: [{
                name: "name",
                description: "The name of the tag you want to edit",
                type: 3,
                required: true
            }, {
                name: "new-name",
                description: "The new name for this tag",
                type: 3,
                required: false
            }, {
                name: "response",
                description: "The new response for this tag",
                type: 3,
                required: false
            }, {
                name: "case",
                description: "Whether the tag is case sensitive or not",
                type: 5,
                required: false
            }, {
                name: "include",
                description: "Whether the tag should be triggered when it is incldued in the message",
                type: 5,
                required: false
            }, {
                name: "embed",
                description: "Whether the response should be a embed",
                type: 5,
                required: false
            }]
        }]
    },
    permissions: ["MANAGE_SERVER"],

    run: async (client, interaction) => {
        await interaction.reply({ content: "Compiling the inputs" });

        const data = await configs.findOne({ id: interaction.guild.id }) || await configs.create({ id: interaction.guild.id }),
            command = interaction.options.getSubcommand(),
            name = interaction.options.getString("name"),
            new_name = interaction.options.getString("new-name"),
            response = interaction.options.getString("response"),
            case_ = interaction.options.getBoolean("case"),
            include = interaction.options.getBoolean("include"),
            embed = interaction.options.getBoolean("embed");

        if (command === "add") {
            if (data?.tags?.filter(v => v.name.toLowerCase() === name.toLowerCase()).length > 0) return interaction.editReply({ content: `You already have a tag with the name \`${name}\`` })

            interaction.editReply({ content: `New tag is added with name \`${name}\`` })

            await configs.findOneAndUpdate({ id: interaction.guild.id }, {
                $push: {
                    tags: {
                        name,
                        response,
                        embed,
                        case: case_,
                        include,
                    }
                }
            })
        } else if (command === "remove") {
            if (data?.tags?.filter(v => v.name.toLowerCase() === name.toLowerCase()).length === 0) return interaction.editReply({ content: `You do not have a tag with the name \`${name}\`` })

            interaction.editReply({ content: `the tag with name \`${name}\` is removed` })

            await configs.findOneAndUpdate({ id: interaction.guild.id }, { tags: data.tags.filter(v => v.name.toLowerCase() !== name.toLowerCase()) })
        } else if (command === "edit") {
            let tag = data?.tags?.filter(v => v.name.toLowerCase() === name.toLowerCase())[0];
            if (!tag) return interaction.editReply({ content: `You do not have a tag with the name \`${name}\`` })

            interaction.editReply({ content: `The tag with name \`${name}\` is edited successfully ✔` })
            
            const tags = data.tags.filter(v => v.name.toLowerCase() !== name.toLowerCase());

            tags.push({
                name: new_name || tag.name,
                response: response || tag.response,
                embed: typeof (embed) !== "boolean" ? tag.embed : embed,
                case: typeof (case_) !== "boolean" ? tag.case : case_,
                include: typeof (include) !== "boolean" ? tag.include : include,
            })

            await configs.findOneAndUpdate({ id: interaction.guild.id }, {
                tags
            })
        }
    }
}