const users = require('../../models/user_xp');
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment, TextChannel } = require('discord.js');

module.exports = {
    data: {
        name: "rank",
        description: "Check your rank!",
        options: [{
            name: "user",
            description: "Mention a user",
            required: false,
            type: 6,
        }],
    },

    run: async (client, interaction) => {
        await interaction.reply("Calculating data!");

        const user = interaction.options.getUser("user") || interaction.user;
        let datas = await users.find({ guild: interaction.guild.id }) || {}, data, rank;

        for (let i = 0; i < datas.length; i++) {
            let v = datas[i];

            if (v.user === user.id) {
                data = v;
                rank = i + 1;
                break;
            }
        };

        if (!data) return interaction.editReply("you have no xp & data")

        let reqXP = 100;

        for (let i = 1; i <= data.level; i++)reqXP += 5 * (i ^ 2) + (50 * i) + 100;

        const canvas = createCanvas(1000, 300),
            ctx = canvas.getContext('2d'),
            bar_width = 600,
            bg = await loadImage("https://cdn.discordapp.com/attachments/725600118098886657/933972874765680720/3b30adb3-2147-42d3-a4f6-a869c3d71723.png"),
            av = await loadImage(interaction.user.displayAvatarURL({ format: 'png', dynamic: false }));

        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        // Middle circle for Avatar Background
        ctx.beginPath();
        ctx.arc(120, 120, 110, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();

        // XP Bar
        ctx.lineJoin = "round";
        ctx.lineWidth = 69;

        // Shadow of xp bar
        ctx.strokeRect(298, 199, bar_width, 2);

        // Empty Bar
        ctx.strokeStyle = "black";
        ctx.strokeRect(300, 200, bar_width, 0);

        // Filled Bar
        ctx.strokeStyle = "#1762e8"
        ctx.strokeRect(300, 200, bar_width * data.xp / reqXP, 0);

        // Adding Username
        ctx.font = "bold 40px Sans";
        ctx.fillStyle = "#fe5701"; // Username color
        ctx.textAlign = "center";
        ctx.fillText(user.username, 120, 275, 200);

        // Adding stats
        ctx.fillText("#" + rank, 760, 40, 80);
        ctx.fillText(data.level, 930, 40, 80);

        // Adding titles
        ctx.fillStyle = "white";
        ctx.font = "bold 25px Sans";
        ctx.fillText("Rank", 680, 40, 200);
        ctx.fillText("Level", 850, 40, 200);

        // Adding bar title
        ctx.fillStyle = "#white";
        ctx.font = "bold 22px Serif";
        ctx.fillText(`${data.xp}/${reqXP} XP`, 850, 150);
        ctx.fillText(`${((data.xp * 100) / reqXP).toFixed(0)}/100 %`, 350, 150);

        // Remove the corners
        ctx.beginPath();
        ctx.arc(120, 120, 110, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        // Add the avatar
        ctx.drawImage(av, 10, 10, 220, 200);

        const at = new MessageAttachment(canvas.toBuffer(), "rank.png");

        interaction.editReply({
            files: [at]
        })
    }
}