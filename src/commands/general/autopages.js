const page = require('../../utility/pagination');

module.exports = {
    data: {
        name: "auto-pages",
        description: "make some automatic pages",
        options: [],
    },
    timeout: 5000,

    run: async (client, interaction) => {
        let s = "hello world I am just testing some cool as bull shit trust me on that man, alr? you get me. I am bored writing long string is boring, so i will use repeat function to repeat the same text again and again lol.\nhello world I am just testing some cool as bull shit trust me on that man, alr? you get me. I am bored writing long string is boring, so i will use repeat function to repeat the same text again and again lol.\nhello world I am just testing some cool as bull shit trust me on that man, alr? you get me. I am bored writing long string is boring, so i will use repeat function to repeat the same text again and again lol.\nhello world I am just testing some cool as bull shit trust me on that man, alr? you get me. I am bored writing long string is boring, so i will use repeat function to repeat the same text again and again lol.\nhello world I am just testing some cool as bull shit trust me on that man, alr? you get me. I am bored writing long string is boring, so i will use repeat function to repeat the same text again and again lol.\nhello world I am just testing some cool as bull shit trust me on that man, alr? you get me. I am bored writing long string is boring, so i will use repeat function to repeat the same text again and again lol.\nhello world I am just testing some cool as bull shit trust me on that man, alr? you get me. I am bored writing long string is boring, so i will use repeat function to repeat the same text again and again lol.\n".repeat(20);
 
        s = s.match(/[\s\S]{1,1000}[\s\n]/g);

        const pages = s.map((v,i) => {
            return {
                title:`Page Number ${i+1}`,
                description:v
            }
        });

        page(interaction,pages)
    }
}