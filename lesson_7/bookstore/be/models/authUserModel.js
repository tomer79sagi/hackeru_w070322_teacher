const mongoose = require("mongoose");

// 'currency': EUR, USD, ILS, etc...
const UserSchema = mongoose.Schema({
    username: String,
    password: String
})

const UserModel = mongoose.model("UserModel", UserSchema, "users");

module.exports = UserModel;
