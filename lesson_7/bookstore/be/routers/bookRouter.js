const express = require("express");
const router = express.Router();
const fs = require("fs");
const { bool } = require("joi");
const verify_logged_in = require("../middleware/verify_logged_in");
const BookModel = require("../models/bookModel");
const BookModelJOI = require("../models/bookModelJoi");

// GET http://localhost:3000/api/books
router.get("/", async (request, response) => {

    try {
        const books = await BookModel.find();
        response.json(books);
    } catch(err) {
        response.status(500).send(err.message);
    }

});

// GET http://localhost:3000/api/books/3453453453
router.get("/:_isbn", async (request, response) => {

    try {
        const book = await BookModel.findOne({isbn: request.params._isbn});
        response.json(book);
    } catch(err) {
        response.status(500).send(err.message);
    }

});

// DELETE http://localhost:3000/api/books/9788532520056
router.delete("/:_isbn", async (request, response) => {
    try {
        // Merge 'request.body' with 'request.params'
        const params = {...request.body, ...request.params};

        // 2**. Validate the request with the JOI model
        const errors = BookModel.validateDelete(params); // synchronized method for running validations
        if (errors)
            return response.status(400).send(errors);
            
        const book = new BookModel(params);
        await BookModel.deleteOne({"isbn": isbn});

        // When using DELETE, the standard is to send the 204 status without any content
        response.sendStatus(204);
    } catch(err) {
        response.status(500).send(err.message);
    }
});

// POST http://localhost:3000/api/books
router.post("/", verify_logged_in, async (request, response) => {
    try {
        // 1**. Create BookModel from 'request.body' / 'Network' tab (in F12 mode) > Filter: 'Fetch/XHR' > 'Payload' tab
        // const book = new BookModel({isbn: "666", title: "The best book ever ever."});
        
        // 2**. Validate the request with the JOI model
        const errors = BookModel.validatePost(request.body); // synchronized method for running validations
        if (errors)
            return response.status(400).send(errors);

        // 3**. Create a Mongoose Model based on the JOI Model
        const book = new BookModel(request.body);

        // 4. Execute 'BookModel.save();' -> Will be granted a new '_id' from the DB
        await book.save();

        // 5. Send back success response. '201' status means CREATED, and we need to convert the 'book' object to a JSON object
        response.status(201).json(book);
    } catch(err) {
        response.status(500).send(err.message);
    }
});


// PUT http://localhost:3000/api/books/init
router.put("/init", async (request, response) => {

    // 1. Clear the 'books' collection from all entries
    BookModel.collection.drop();

    // 2. Read the baseline .json data from 'books.json'
    // Read the baseline 'books' array from a JSON file
    fs.readFile('./dal/books.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            response.json("Fail");
            return;
        }

        // Success file read
        // 3. Insert all of the .json data into the 'books' collection
        const jsData = JSON.parse(data);

        jsData.books.forEach(element => {
            new BookModel(element).save();
        });

        response.json("Success");
    });

});

// PUT http://localhost:3000/api/books/9788532520056
// Statuses:
//  - 200: Successfully updated the book
//  - 400: Validation error (ProductModel is invalid)
//  - 404: Book with provided ISBN cannot be found in DB
//  - 500: General server-side srror
router.put("/:_isbn", async (request, response) => {

    // 1. Create a try/catch block.
    try {
        // 3. Extract the 'book' properties from the 'request.body'
        const book = request.body;
        book.isbn = request.params._isbn;

        // 4. [Validate Book Object] --> ...
         // const book = new BookModel({isbn: "666", title: "The best book ever ever."});
        const joiBook = new BookModelJOI(book);

        // 2**. Validate the request with the JOI model
        const errors = joiBook.validatePut(); // synchronized method for running validations
        if (errors)
            return response.status(400).send(errors);

        // 5. Execute mongoose 'update' function with 'isbn' and the book 'object'
        const updatedBook = await BookModel.updateOne({isbn: book.isbn}, book);

        //  - [No ISBN provided OR ISBN doesn't exist in DB] return status 404
        if (updatedBook.matchedCount === 0)
            response.sendStatus(404);
        
        //  - [Success] return status 200
        else
            response.json({modified: updatedBook.modifiedCount});

    // -. [Any unknown exception] return status 500 (..catch..)
    } catch(err) {
        response.status(500).send(err.message);
    }
    
});

module.exports = router;