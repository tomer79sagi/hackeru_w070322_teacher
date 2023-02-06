const jwt = require("jsonwebtoken");

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
    jwt.verify(token, "SuchAPerfectDay", (err, payload) => {
        
        // A. If 'err' exists: [1] Token expired, [2] All else
        if (err && err.message === "jwt expired") {
            return res.status(403).send("Your session has expired.");
        }

        if (err) {
            return res.status(401).send("You are not authorized to access this resource.");
        }

        // B. If all is well, 'next()'
        next();
    });


    // console.log(`'${req.path}' called [Verify Logged In - Middleware]`);
    // const token = req.body['token'];

    // Check if token doesn't exist or token is NOT equal "TomerIsTheMan"
    // if (token && token === "TomerIsTheMan") { // Positive
    // if (!token || token !== "TomerIsTheMan") { // Negative
    //     return res.status(401).json("You don't have permission to access this resource");
    // }

    // next();
}

module.exports = verify_logged_in;