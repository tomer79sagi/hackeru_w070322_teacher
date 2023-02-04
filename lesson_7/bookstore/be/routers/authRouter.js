const express = require("express");
const router = express.Router();
const AuthUserModelJOI = require("../models/authUserModelJoi");
const AuthUserModel = require("../models/authUserModel");

// Register
// POST http://localhost:3000/api/auth/register
router.post("/register", async (request, response) => {

    try {
        const userModel = new AuthUserModelJOI(request.body);
        const errors = userModel.validateRegistration(); // synchronized method for running validations
        if (errors)
            return response.status(400).send(errors);

        const user = new AuthUserModel(userModel);
        await user.save();

        response.status(201).json(user);
    } catch(err) {
        response.status(500).send(err.message);
    }

});

// Login

// Logout

module.exports = router;