const mongoose = require("mongoose");
const JOI = require("joi");

// 'currency': EUR, USD, ILS, etc...
const BookSchema = mongoose.Schema({
    isbn: String,
    title: String,
    description: String,
    price: Number,
    currency: String,
    quantity: Number
})

BookSchema.loadClass(Val);

// JOI Validations
const baselineValidation = {
    isbn: JOI.number().required(),
    title: JOI.string().required().min(2).max(400),
    description: JOI.string(),
    price: JOI.number().required().min(1).max(200),
    currency: JOI.string().required().min(3).max(3),
    quantity: JOI.number().required()
};

// Post Validation, using 'spread', copying of the object to avoid changing the original version
BookSchema.statics.validatePost = (obj) => {
    return JOI.object({
        ...baselineValidation, 
        id: JOI.string().forbidden()
    }).validate(obj, { abortEarly: false });
}

// Put Validation
BookSchema.statics.validatePut = (obj) => {
    return JOI.object({
        ...baselineValidation
    }).validate(obj, { abortEarly: false });
}

// Delete Validation
BookSchema.statics.validateDelete = (obj) => {
    return JOI.object({
        id: JOI.string().forbidden(), 
        isbn: JOI.number().required()
    }).validate(obj, { abortEarly: false });
}

const BookModel = mongoose.model("BookModel", BookSchema, "books");

module.exports = BookModel;
