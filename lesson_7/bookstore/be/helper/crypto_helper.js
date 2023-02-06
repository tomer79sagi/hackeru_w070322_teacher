const crypto = require("crypto");

function hash(text) {
    if(!text) return null;

    // Hashing with salt:
    const salt = "TomerIsTheMan"; // 2nd layer of security for the hashed text

    // Create a Hash from the given text using SHA512 algorithm and output HEXADECIMAL result
    return crypto.createHmac("sha512", salt).update(text).digest("hex");
}

module.exports = { hash };