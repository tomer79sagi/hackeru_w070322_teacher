const mongoose = require("mongoose");
const JOI = require("joi");

// 'currency': EUR, USD, ILS, etc...
const UserSchema = mongoose.Schema({
    username: String,
    password: String
})

// The baseline / common denominator of validation for 2 or more endpoint validations
const baselineValidation = {
    username: JOI.string().required().min(3).max(20),
    password: JOI.string().required().min(8).max(12)
};

// Validate Registration
UserSchema.statics.validateRegistration = (obj) => {
    return JOI.object({ ...baselineValidation }).validate(obj, { abortEarly: false });
}

// Validate Login
UserSchema.statics.validateLogin = (obj) => {
    return JOI.object({ ...baselineValidation }).validate(obj, { abortEarly: false });
}

const UserModel = mongoose.model("UserModel", UserSchema, "users");

module.exports = UserModel;
