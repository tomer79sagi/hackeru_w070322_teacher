const JOI = require("joi");

// How to use this class from the 'controller'?
// 1. const joiProduct = new ProductModelJOI({isbn: 444, title: "Jeff", ....});
// 2. const errors = joiProduct.validatePost();
// 3. const productModel = new ProductModel(joiProduct);
// 4. productModel.save();
class ProductModelJOI {

    // 1. Constructor that accepts an object with the ProductModel properties
    constructor(object) {
        this.isbn = object.isbn;
        this.title = object.title;
        this.description = object.description;
        this.price = object.price;
        this.currency = object.currency;
        this.quantity = object.quantity;
    }

    // The baseline / common denominator of validation for 2 or more endpoint validations
    static #baselineValidation = {
        isbn: JOI.number().required(),
        title: JOI.string().required().min(2).max(400),
        description: JOI.string(),
        price: JOI.number().required().min(1).max(200),
        currency: JOI.string().required().min(3).max(3),
        quantity: JOI.number().required()
    };

    static #postValidation = JOI.object( ProductModelJOI.#baselineValidation ).keys({id: JOI.string().forbidden()});
    static #putValidation = JOI.object( ProductModelJOI.#baselineValidation );
    static #deleteValidation = JOI.object({
        id: JOI.string().forbidden(),
        isbn: JOI.number().required()
    });

    // 2. Method to validate the JOI object against a JOI schema
    validatePost() {
        // 2.2. Validate this 'ProductModelJOI' object against the JOI schema
        const result = ProductModelJOI.#postValidation.validate(this, {abortEarly: false});
        return result.error ? result.error : null;
    }

    validatePut() {
        // 2.2. Validate this 'ProductModelJOI' object against the JOI schema
        const result = ProductModelJOI.#putValidation.validate(this, {abortEarly: false});
        return result.error ? result.error : null;
    }

    validateDelete() {
        // 2.2. Validate this 'ProductModelJOI' object against the JOI schema
        const result = ProductModelJOI.#deleteValidation.validate(this, {abortEarly: false});
        return result.error ? result.error : null;
    }
}

module.exports = ProductModelJOI;
