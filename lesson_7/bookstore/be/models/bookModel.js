const mongoose = require("mongoose");

// 'currency': EUR, USD, ILS, etc...
const BookSchema = mongoose.Schema({
    isbn: String,
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 400
    },
    description: String,
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 200
    },
    currency: {
        type: String,
        required: [true, "'currency' is missing."],
        minlength: 3,
        maxlength: 3
    },
    quantity: Number
})

const BookModel = mongoose.model("BookModel", BookSchema, "books");

module.exports = BookModel;
