

col.on('collect', async (i) => {
    if (i.customId === "result") {
        try {
            data = `${math.evaluate(data)}`;
        } catch (e) {
            data = "An Error Occured, Click on AC for restart"
        }
    } else if (i.customId === "backspace") {
        data = data.slice(0, data.length - 2);
    } else if (i.customId === "clear") {
        data = "";
    } else {
        data += `${(
            (parseInt(i.customId) == i.customId || i.customId === ".")
            &&
            (data[data.length - 1] == parseInt(data[data.length - 1]) || data[data.length - 1] === ".")
        ) ? "" : " "
            }${i.customId}`;
    }

    i.update({
        embeds: [{
            description: `\`\`\`\n${data || "Results will be displayed here"}\n\`\`\``,
            color: "BLUE"
        }]
    })
})

