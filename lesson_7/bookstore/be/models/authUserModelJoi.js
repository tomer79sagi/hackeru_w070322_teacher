const JOI = require("joi");

// How to use this class from the 'controller'?
// 1. const joiProduct = new ProductModelJOI({isbn: 444, title: "Jeff", ....});
// 2. const errors = joiProduct.validatePost();
// 3. const productModel = new ProductModel(joiProduct);
// 4. productModel.save();
class AuthUserModelJOI {

    // 1. Constructor that accepts an object with the ProductModel properties
    constructor(object) {
        this.username = object.username;
        this.password = object.password;
    }

    // The baseline / common denominator of validation for 2 or more endpoint validations
    static #baselineValidation = {
        username: JOI.string().required().min(3).max(20),
        password: JOI.string().required().min(8).max(12)
    };

    static #registerValidation = JOI.object( AuthUserModelJOI.#baselineValidation );
    static #loginValidation = JOI.object( AuthUserModelJOI.#baselineValidation );

    // 2. Method to validate the JOI object against a JOI schema
    validateRegistration() {
        // 2.2. Validate this 'ProductModelJOI' object against the JOI schema
        const result = AuthUserModelJOI.#registerValidation.validate(this, {abortEarly: false});
        return result.error ? result.error : null;
    }

    validateLogin() {
        // 2.2. Validate this 'ProductModelJOI' object against the JOI schema
        const result = AuthUserModelJOI.#loginValidation.validate(this, {abortEarly: false});
        return result.error ? result.error : null;
    }
}

module.exports = AuthUserModelJOI;
