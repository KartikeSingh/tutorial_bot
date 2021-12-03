const purger = new (require('discord-purger'))();

module.exports = {
    data: {
        name: "purge",
        description: "Purge those trash messages!",
        options: [
            {
                name: "messages", description: "Purge all messages of this channel", type: 1,
                options: [
                    { name: "number", type: 4, description: "Number of messages to purge", required: true }
                ]
            },
            { name: "bot-messages", description: "Purge All bot messages in this channel", type: 1 },
            {
                name: "link-messages", description: "Purge all messages which contains link", type: 1,
                options: [
                    { name: "number", type: 4, description: "Number of messages to purge", required: true }
                ]
            },
            {
                name: "emoji-messages", description: "Purge all messages which contains emojis", type: 1,
                options: [
                    { name: "number", type: 4, description: "Number of messages to purge", required: true }
                ]
            },
            {
                name: "attachment-messages", description: "Purge all messages which contains attachments", type: 1,
                options: [
                    { name: "number", type: 4, description: "Number of messages to purge", required: true }
                ]
            },
            {
                name: "user-messages", description: "Purge all messages of a user", type: 1,
                options: [
                    { name: "number", type: 4, description: "Number of messages to purge", required: true }, { name: "user", type: 6, description: "The user who's messages you want to purge", required: true }
                ]
            },
            {
                name: "messages-equal", description: "Purge all messages which are equal to something", type: 1,
                options: [
                    { name: "number", type: 4, description: "Number of messages to purge", required: true }, { name: "string", type: 3, description: "The thing to which message should be equal to", required: true }
                ]
            },
            {
                name: "messages-includes", description: "Purge all messages which conatins something in them", type: 1,
                options: [
                    { name: "number", type: 4, description: "Number of messages to purge", required: true }, { name: "string", type: 3, description: "The thing which message should conatins", required: true }
                ]
            },
            {
                name: "messages-starts", description: "Purge all messages which starts with something", type: 1,
                options: [
                    { name: "number", type: 4, description: "Number of messages to purge", required: true }, { name: "string", type: 3, description: "The thing with which message should start", required: true }
                ]
            },
            {
                name: "messages-ends", description: "Purge all messages which ends with something", type: 1,
                options: [
                    { name: "number", type: 4, description: "Number of messages to purge", required: true }, { name: "string", type: 3, description: "The thing with which message should end", required: true }
                ]
            },
        ],
    },
    permissions: ["MANAGE_MESSAGES"],

    run: async (client, interaction) => {
        const messages = interaction.options.getInteger("number") || 2,
            user = interaction.options.getUser("user"),
            string = interaction.options.getString("string");

        await interaction.reply({ content: "Purging!", ephemeral: true });

        purger.purge(interaction.options.getSubcommand(), interaction, interaction.channel, messages, user || string);
    }
}