module.exports = (client) => {
    console.log("Client is up");

    client.application.commands.set([...client.commands.map(v => v.data)], "732883841395720213")
}