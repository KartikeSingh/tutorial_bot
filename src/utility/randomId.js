const STRING = "QWERTYUIOPASDFGHJKLZXCVBNM",
    STRING2 = STRING.toLowerCase(),
    NUMBER = "1234567890",
    chars = STRING + STRING2 + NUMBER;

module.exports = (length = 12) => {
    let pass = "";

    while (pass.length < length) pass += chars[Math.floor(Math.random() * chars.length)];

    return pass;
}