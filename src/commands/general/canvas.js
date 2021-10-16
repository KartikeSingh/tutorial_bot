const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');

module.exports = {
    data: {
        name: "canvas",
        description: "Create a canvas",
        options: [],
    },
    run: async (client, interaction) => {
        const canvas = createCanvas(1200, 700);
        const ctx = canvas.getContext('2d');
        const avatar = await loadImage(interaction.user.displayAvatarURL({ dynamic: false, format: "png" }));
        const diameter = 500;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "black";
        ctx.font = "bold 50px Impact"
        ctx.textAlign = "center";
        ctx.fillText("Filled text", 600, 670);

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, diameter / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar, canvas.width / 2 - diameter / 2, canvas.height / 2 - diameter / 2, diameter, diameter);

        const image = new MessageAttachment(canvas.toBuffer(), "image.png");
        interaction.reply({ files: [image] });
    }
}