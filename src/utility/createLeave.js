const { createCanvas, loadImage, registerFont } = require('canvas');

// NOTE: create a file called tommy.ttf in main folder of your bot and you can download file from here: https://github.com/KartikeSingh/tutorial_bot/blob/master/tommy.ttf
registerFont("./tommy.ttf", {
    family: "tommy"
});

module.exports = async (member) => {
    return new Promise(async (res, rej) => {
        try {
            const canvas = createCanvas(850, 450);
            const ctx = canvas.getContext('2d');
            const r = 160;

            const bg = await loadImage("https://cdn.discordapp.com/attachments/723104565708324915/944119444928606288/PicsArt_02-18-12.03.27.jpg"),
                av = await loadImage(member.user.displayAvatarURL({ format: 'png' }));

            // Background of the image
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            // Adding the Text
            ctx.font = "bold 55px tommy";
            ctx.fillStyle = "#ff4d00";
            ctx.textAlign = "center";
            ctx.lineWidth = 2;

            // Text Shadow
            ctx.shadowBlur = 1.5;
            ctx.shadowColor = "#ff4d00";

            ctx.fillText(`${member.user.tag}`, canvas.width / 2, 285, 800);
            ctx.strokeText(`${member.user.tag}`, canvas.width / 2, 285, 800);

            ctx.font = "bold 65px tommy";

            ctx.fillText("Left The Community", canvas.width / 2, 360, 800);
            ctx.strokeText("Left The Community", canvas.width / 2, 360, 800);

            // Removing the shadow
            ctx.shadowBlur = 0;

            // Border of the Avatar
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2.9, r / 2, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();

            // Clipping the avatar
            ctx.beginPath();
            ctx.arc((canvas.width / 2), (canvas.height / 2.9), r / 2, 0, 2 * Math.PI);
            ctx.clip();
            ctx.closePath();

            // Adding the avatar
            ctx.drawImage(av, (canvas.width / 2 - r / 2), (canvas.height / 2 - r) + 10, r, r);

            res(canvas.toBuffer());
        } catch (e) {
            rej(e);
        }
    })
}