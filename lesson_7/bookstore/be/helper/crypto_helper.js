const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

const cookieOptions = {
    httpOnly: true,
    expires: dayjs().add(config.token.cookie.expiryPeriod, config.token.cookie.expiryType).toDate(),
};

function hash(text) {
    if(!text) return null;

    // Create a Hash from the given text using SHA512 algorithm and output HEXADECIMAL result
    return crypto.createHmac("sha512", config.salts.hash).update(text).digest("hex");
}

function jwtSign(object) {
    return jwt.sign({ object }, config.salts.jwt, { expiresIn: config.token.expiry });
}

// a 'verify' JWT wrapper function which executes the 'jwt.verify' function
// If provides the 'token' and a 'callback' function which includes an 'err' object if an error was generated
// of nothing 'callFunction()' if no error was created
function jwtVerify(token, callFunction) {

    jwt.verify(token, config.salts.jwt, (err, payload) => {
        
        // A. If 'err' exists: [1] Token expired
        if (err && err.message === "jwt expired") {
            callFunction({status: 403, message: "Your session has expired."});
            return;
        }

        // [2] All else
        if (err) {
            callFunction({status: 401, message: "You are not authorized to access this resource."});
            return;
        }

        // B. If all is well, 'callFunction' without an 'error' object
        callFunction();
    });
}

module.exports = {
    hash,
    jwtSign,
    jwtVerify,
    cookieOptions
};