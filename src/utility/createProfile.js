module.exports = async (username, avatarUrl, badges) => {
    const { createCanvas, loadImage, registerFont } = require('canvas');
    const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');

    registerFont("./tommy.ttf", {
        family: "tommy"
    });

    const canvas = createCanvas(400, 135 + (badges.length / 5 * 45));
    const ctx = canvas.getContext('2d');

    // For Colored Background
    // ctx.fillStyle = '#000000'; // hex code color for the background
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // For Image Backgroumd
    const bg = await loadImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8mA2D-Ye7VZhUL9GV7vpCUnxoetlYVac2UQns-M8DsbULCNFSqaaQEdx12k1KsPM2I40&usqp=CAU"); // background image url
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const av = await loadImage(avatarUrl);

    ctx.drawImage(av, 5, 5, 140, 140);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px tommy"

    ctx.fillText(username, 155, 40, 220);

    for (let i = 0; i < badges.length; i++) {
        let row = Math.floor(i / 5), element = i % 5;

        await fillTextWithTwemoji(ctx, badges[i], 155 + (element * 40), 80 + (row * 50))
    }

    return canvas.toBuffer();
}