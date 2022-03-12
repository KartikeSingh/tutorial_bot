const pagination = require("../../utility/pagination2")

module.exports = {
    data: {
        name: "pages",
        description: "Test the select menu pagination of the bot",
        options: [],
    },
    timeout: 10000,

    run: async (client, interaction) => {
        const
            pages = [
                { title: "Page 1" },
                { title: "Page 2" },
                { title: "Page 3" },
            ],
            options = [{
                label: "Page 1",
                emoji: '1️⃣'
            }, {
                label: "Page 2",
                emoji: '2️⃣'
            }, {
                label: "Page 3",
                emoji: '3️⃣'
            }];


        pagination(interaction, pages, options)
    }
}