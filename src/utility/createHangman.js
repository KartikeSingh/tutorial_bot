const { createCanvas } = require('canvas');

module.exports = async (state = 0) => {
    return new Promise((res) => {
        const canvas = createCanvas(300, 350);
        const ctx = canvas.getContext('2d');

        ctx.lineWidth = 5;

        // Poll base
        createLine(ctx, 50, 330, 150, 330);

        // Poll Mid
        createLine(ctx, 100, 330, 100, 50);

        // Poll Head
        createLine(ctx, 100, 50, 200, 50);

        // Poll To Man Connector
        createLine(ctx, 200, 50, 200, 80);

        // Head
        ctx.strokeStyle = state < 1 ? "#a3a3a3" : "#000000";
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        // Main Body
        createLine(ctx, 200, 120, 200, 200, state < 2 ? "#a3a3a3" : "#000000");

        // Hands
        createLine(ctx, 200, 150, 170, 130, state < 3 ? "#a3a3a3" : "#000000");
        createLine(ctx, 200, 150, 230, 130, state < 4 ? "#a3a3a3" : "#000000");

        // Legs
        createLine(ctx, 200, 200, 180, 230, state < 5 ? "#a3a3a3" : "#000000");
        createLine(ctx, 200, 200, 220, 230, state < 6 ? "#a3a3a3" : "#000000");

        res(canvas.toBuffer())
    })
}

function createLine(ctx, fromX, fromY, toX, toY, color = "#000000") {
    ctx.beginPath();

    ctx.strokeStyle = color;
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.closePath();
}