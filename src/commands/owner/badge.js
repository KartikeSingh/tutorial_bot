const { hasEmoji } = require('node-emoji');

const badges = require('../../models/badge');
const users = require('../../models/userConfig');
const randomId = require('../../utility/randomId');

module.exports = {
    data: {
        name: "badge",
        description: "Manage badges of the bot",
        options: [{
            name: 'create',
            description: "Create a new badge",
            type: 1,
            options: [{
                name: 'name',
                description: "Name of this badge",
                type: 3,
                required: true
            }, {
                name: 'emoji',
                description: "Emoji of this badge",
                type: 3,
                required: true
            }]
        }, {
            name: 'edit',
            description: "Edit a new badge",
            type: 1,
            options: [{
                name: 'id',
                description: "ID of the badge you want to edit",
                type: 3,
                required: true
            }, {
                name: 'name',
                description: "New name of this badge",
                type: 3,
                required: false
            }, {
                name: 'emoji',
                description: "New emoji of this badge",
                type: 3,
                required: false
            }]
        }, {
            name: 'delete',
            description: "Delete a new badge",
            type: 1,
            options: [{
                name: 'id',
                description: "ID of the badge you want to delete",
                type: 3,
                required: true
            }]
        }, {
            name: 'give',
            description: "Give a badge to someone",
            type: 1,
            options: [{
                name: 'id',
                description: "ID of the badge you want to give",
                type: 3,
                required: true
            }, {
                name: 'user-id',
                description: "ID of the user to whom you want to give the badge",
                type: 3,
                required: true
            }]
        }, {
            name: 'take',
            description: "Take a badge from someone",
            type: 1,
            options: [{
                name: 'id',
                description: "ID of the badge you want to take",
                type: 3,
                required: true
            }, {
                name: 'user-id',
                description: "ID of the user from whom you want to take the badge",
                type: 3,
                required: true
            }]
        }]
    },

    run: async (client, interaction) => {
        if (!client.owners.includes(interaction.user.id)) return interaction.reply({ content: `You are not a owner` });

        await interaction.deferReply();

        let option = interaction.options.getSubcommand(),
            id = interaction.options.getString("id"),
            name = interaction.options.getString("name"),
            emoji = interaction.options.getString("emoji")?.split(/ +/g)[0],
            user_id = interaction.options.getString("user-id"),
            user = client.users.cache.get(user_id),
            userData = user ? await users.findOne({ user: user?.id }) || await users.create({ user: user?.id }) : null,
            badge = await badges.findOne({ id });

        if (option === "create") {
            if (!isEmoji(client, emoji)) return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid Emoji",
                    description: "Please provide a valid emoji"
                }]
            });

            badge = await badges.create({
                id: randomId(8),
                name,
                emoji,
                createdAt: Date.now()
            });

            interaction.editReply({
                embeds: [{
                    title: "✅ Successfully created the badge!",
                    fields: [{
                        name: "Badge ID",
                        value: badge.id,
                        inline: true
                    }, {
                        name: "Badge Name",
                        value: badge.name,
                        inline: true
                    }, {
                        name: "Badge Emoji",
                        value: client.emojis.cache.get(badge.emoji) || badge.emoji || "Unknown",
                        inline: true
                    }, {
                        name: "Created At",
                        value: new Date(badge.createdAt)?.toString() || "Unknown Date",
                        inline: true
                    }]
                }]
            })
        } else if (option === "edit") {
            if (!badge) return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid badge",
                    description: "Please provide a valid badge ID"
                }]
            });

            name = name || badge.name;
            emoji = emoji || badge.emoji;

            if (!isEmoji(client, emoji)) return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid Emoji",
                    description: "Please provide a valid emoji"
                }]
            });

            badge = await badges.findOneAndUpdate({ id }, {
                name,
                emoji,
                createdAt: Date.now()
            }, { new: true });

            interaction.editReply({
                embeds: [{
                    title: "✅ Successfully edited the badge!",
                    fields: [{
                        name: "Badge ID",
                        value: badge.id,
                        inline: true
                    }, {
                        name: "Badge Name",
                        value: badge.name,
                        inline: true
                    }, {
                        name: "Badge Emoji",
                        value: client.emojis.cache.get(badge.emoji) || badge.emoji || "Unknown",
                        inline: true
                    }, {
                        name: "Created At",
                        value: new Date(badge.createdAt)?.toString() || "Unknown Date",
                        inline: true
                    }]
                }]
            })
        } else if (option === "delete") {
            if (!badge) return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid badge",
                    description: "Please provide a valid badge ID"
                }]
            });

            await badges.findOneAndDelete({ id });

            interaction.editReply({
                embeds: [{
                    title: "✅ Badge Deleted",
                }]
            });
        } else if (option === "give") {
            if (!badge) return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid badge",
                    description: "Please provide a valid badge ID"
                }]
            });

            if (!user) return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid User",
                    description: "Please provide a valid user ID"
                }]
            });

            if (userData?.badges?.includes(badge.id)) return interaction.editReply({
                embeds: [{
                    title: "❌ Cannot Add Badge",
                    description: "The provided user already have this badge!"
                }]
            });

            await users.findOneAndUpdate({ user: user.id }, { $push: { badges: badge.id } });

            interaction.editReply({
                embeds: [{
                    title: "✅ Badge Added",
                    description: `Successfully gave **${badge.name}** to **${user.username}**`
                }]
            });
        } else if (option === "take") {
            if (!badge) return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid badge",
                    description: "Please provide a valid badge ID"
                }]
            });

            if (!user) return interaction.editReply({
                embeds: [{
                    title: "❌ Invalid User",
                    description: "Please provide a valid user ID"
                }]
            });

            if (!userData?.badges?.includes(badge.id)) return interaction.editReply({
                embeds: [{
                    title: "❌ Cannot Take Badge",
                    description: "The provided user do not have this badge!"
                }]
            });

            await users.findOneAndDelete({ user: user.id }, { $pull: { badges: badge.id } });

            interaction.editReply({
                embeds: [{
                    title: "✅ Badge Remove",
                    description: `Successfully took **${badge.name}** from **${user.username}**`
                }]
            });
        }
    }
}
function isEmoji(client, emoji) {
    return hasEmoji(emoji) || client.emojis.cache.get(/\d+/.exec(emoji) + "");
}