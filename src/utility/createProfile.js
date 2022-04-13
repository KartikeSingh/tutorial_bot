module.exports = async (username, avatarUrl, badges) => {
    const { createCanvas, loadImage } = require('canvas');
    const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');

    const canvas = createCanvas(400, 150 + (badges.length / 5 * 45));
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const av = await loadImage(avatarUrl);

    ctx.drawImage(av, 5, 5, 140, 140);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px Sans"

    ctx.fillText(username, 155, 40, 220);

    for (let i = 0; i < badges.length; i++) {
        let row = Math.floor(i / 5), element = i % 5;

        await fillTextWithTwemoji(ctx, badges[i], 155 + (element * 40), 80 + (row * 50))
    }

    return canvas.toBuffer();
}