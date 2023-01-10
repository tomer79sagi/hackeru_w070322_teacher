const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
    isbn: String,
    title: String,
    description: String,
    price: Number,
    quantity: Number
})

const BookModel = mongoose.model("BookModel", BookSchema, "books");

module.exports = BookModel;
