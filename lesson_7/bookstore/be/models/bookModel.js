const mongoose = require("mongoose");

// 'currency': EUR, USD, ILS, etc...
const BookSchema = mongoose.Schema({
    isbn: String,
    title: String,
    description: String,
    price: Number,
    currency: String,
    quantity: Number
})

const BookModel = mongoose.model("BookModel", BookSchema, "books");

module.exports = BookModel;
