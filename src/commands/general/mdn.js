const getSource = require('../../utility/getMdnSource');
const fetch = require('node-fetch');
const MDN_BASE_URL = "https://developer.mozilla.org/en-US/docs/";

module.exports = {
    data: {
        name: "mdn",
        description: "Browse the mdn docs",
        options: [{
            type: 3,
            required: true,
            description: "The query you want to search",
            name: "query"
        }],
    },

    run: async (client, interaction) => {
        await interaction.reply("Fetching the data");
        const { sitemap, index } = await getSource(), q = interaction.options.getString("query");

        const search = index.search(q, { limit: 10 }).map((id) => sitemap[id].loc);

        if (search?.length === 0) interaction.editReply("YOu sucks the result are not sfound ❌");
        else if (search.length === 1) {
            const res = await fetch(`${MDN_BASE_URL + search[0]}/index.json`);
            const doc = (await res.json()).doc;

            interaction.editReply({
                embeds: [{
                    author: {
                        name: "Mdn Documentation",
                        iconURL: "https://i.imgur.com/1P4wotC.png",
                        url: `${MDN_BASE_URL}${doc.mdn_url}`
                    },
                    url: `${MDN_BASE_URL}${doc.mdn_url}`,
                    color: 0x83BFFF,
                    title: doc.pageTitle,
                    description: doc.summary
                }]
            })
        } else {
            const results = search.map((path) => `**• [${path.replace(/_|-/g, " ")}](${MDN_BASE_URL}${path})**`);

            interaction.editReply({
                embeds: [{
                    author: {
                        name: "Mdn Documentation",
                        iconURL: "https://i.imgur.com/1P4wotC.png",
                        url: `${MDN_BASE_URL}`
                    },
                    color: 0x83BFFF,
                    title: `Search for: ${query}`,
                    description: results.join("\n")
                }]
            })
        }
    }
}

