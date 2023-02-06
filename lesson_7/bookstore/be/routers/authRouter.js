const express = require("express");
// const dayjs = require("dayjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("../helper/crypto_helper");
const AuthUserModelJOI = require("../models/authUserModelJoi");
const AuthUserModel = require("../models/authUserModel");

// Register
// POST http://localhost:3000/api/auth/register
router.post("/register", async (request, response) => {

    try {
        // 1. Validate using JOI (JOI Object = Standard JS Class/Object)
        const userModel = new AuthUserModelJOI(request.body);
        const errors = userModel.validateRegistration(); // synchronized method for running validations
        if (errors)
            return response.status(400).send(errors);

        // 2. Hash the password and replace it in the 'userModel' object (the JOI object)
        userModel.password = crypto.hash(userModel.password);

        // 3. Create and save the JOI model in the DB using Mongoose model and .save()
        const user = new AuthUserModel(userModel);
        await user.save();

        // 4. Create a token (soon to be JWT) to be returned to the client
        // userModel.token = "TomerIsTheMan";
        userModel.token = jwt.sign({ user }, "SuchAPerfectDay", { expiresIn: "5m" });

        // 5. Remove the password so it's not returned to the client
        delete userModel.password;

        // 6. Send the simplified model back to the client
        response.status(201).json(userModel);


        // const dataToSecure = {
        //     dataToSecure: "This is the secret data in the cookie.",
        // };
    
        // response.cookie("secureCookie", JSON.stringify(dataToSecure), {
        //     httpOnly: true,
        //     expires: dayjs().add(30, "days").toDate(),
        // });
    } catch(err) {
        response.status(500).send(err.message);
    }

});

// Login
router.post("/login", async (request, response) => {
    try {
        // 1. Validate using JOI (JOI Object = Standard JS Class/Object)
        const userModel = new AuthUserModelJOI(request.body);
        const errors = userModel.validateRegistration(); // synchronized method for running validations
        if (errors)
            return response.status(400).send(errors);

        // 2. Hash the password and replace it in the 'userModel' object (the JOI object)
        userModel.password = crypto.hash(userModel.password);

        // 3. Check 'username' and hashed 'password' match

        // 4. Create a token (soon to be JWT) to be returned to the client
        userModel.token = "TomerIsTheMan";

        // 5. Remove the password so it's not returned to the client
        delete userModel.password;

        // 6. Send the simplified model back to the client with the token
        response.status(201).json(userModel);
    } catch(err) {
        response.status(500).send(err.message);
    }
});

// Logout

module.exports = router;