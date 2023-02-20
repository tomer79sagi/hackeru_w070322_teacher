const crypto = require("../helper/crypto_helper");

function verify_logged_in(req, res, next) {

    // 1. Check if header containing the token exists (Header = "Authorization")
    if (!req.headers.authorization) {
        return res.status(401).send("You are not authorized to access this resource.");
    }

    // 2. Check if correctly structured token exists ("Bearer {token}")
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).send("You are not authorized to access this resource.");
    }

    // 3. Check if Token is valid (using JWT). If all is well, 'next()'
    crypto.jwtVerify(token, (err) => {
        if (err)
            return res.status(err.status).send(err.message);

        next();
    });
}

module.exports = verify_logged_in;