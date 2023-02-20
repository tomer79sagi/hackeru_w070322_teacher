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

// JOI Validations
const baselineValidation = {
    isbn: JOI.number().required(),
    title: JOI.string().required().min(2).max(400),
    description: JOI.string(),
    price: JOI.number().required().min(1).max(200),
    currency: JOI.string().required().min(3).max(3),
    quantity: JOI.number().required()
};

class Val {
    validatePost() {
        const v = {
            ...baselineValidation, 
            id: JOI.string().forbidden()
        };

        return JOI.object(v).extract(v.keys()).validate(this, { abortEarly: false });
    }

    validateDelete() {
        const v = {
            id: JOI.string().forbidden(), 
            isbn: JOI.number().required()
        };

        return JOI.object(v).extract(v.keys()).validate(this, { abortEarly: false });
    }
}

BookSchema.loadClass(Val);

const BookModel = mongoose.model("BookModel", BookSchema, "books");

module.exports = BookModel;
