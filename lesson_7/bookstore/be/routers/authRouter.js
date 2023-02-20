const express = require("express");
const router = express.Router();
const crypto = require("../helper/crypto_helper");
const UserModel = require("../models/authUserModel");

// Register
// POST http://localhost:3000/api/auth/register
router.post("/register", async (request, response) => {

    try {
        // 1. Validate using JOI (JOI Object = Standard JS Class/Object)
        const valRes = UserModel.validateRegistration(request.body); // synchronized method for running validations
        if (valRes.error)
            return response.status(400).send(valRes.error);

        // 2. Create the 'AuthUserModel' object, hash the password and save to DB
        const user = new UserModel(request.body);
        user.password = crypto.hash(user.password);
        await user.save();

        // 3. Create a token (by JWT) to be returned to the client
        const token = crypto.jwtSign(user);// Instruct the client to store a local 'secure' cookie
        response.cookie("token", token, crypto.cookieOptions);

        // 4. Send the simplified model back to the client
        response.status(201).send(`Successfully registered '${user.username}'.`);
    } catch(err) {
        response.status(500).send(err.message);
    }

});

// Login
router.post("/login", async (request, response) => {
    try {
        // 1. Validate using JOI (JOI Object = Standard JS Class/Object)
        const valRes = UserModel.validateLogin(request.body); // synchronized method for running validations
        if (valRes.error)
            return response.status(400).send(valRes.error);

        // 2. Check 'username' and hashed 'password' match
        const hashedPassword = crypto.hash(request.body.password);
        const loggedInUser = await UserModel.findOne({
            username: request.body.username, 
            password: hashedPassword}).exec();

        if (!loggedInUser)
            return response.status(401).json("Unauthorized");

        // 4. Create a token (soon to be JWT) to be returned to the client
        // Instruct the client to store a local 'secure' cookie
        const token = crypto.jwtSign(loggedInUser);
        response.cookie("token", token, crypto.cookieOptions);

        // 6. Send the simplified model back to the client with the token
        response.status(201).send(`Successfully logged in '${loggedInUser.username}'.`);
    } catch(err) {
        response.status(500).send(err.message);
    }
});

// Logout

module.exports = router;