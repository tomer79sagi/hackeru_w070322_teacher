const express = require("express");
const router = express.Router();
const fs = require("fs");
const BookModel = require("../models/bookModel");

// GET http://localhost:3000/api/books
router.get("/", async (request, response) => {

    try {
        const books = await BookModel.find();
        response.json(books);
    } catch(err) {
        response.status(500).send(err.message);
    }

});

// DELETE http://localhost:3000/api/books/9788532520056
router.delete("/:_isbn", async (request, response) => {
    try {
        const isbn = request.params._isbn;
        await BookModel.deleteOne({"isbn": isbn});

        // When using DELETE, the standard is to send the 204 status without any content
        response.sendStatus(204);
    } catch(err) {
        response.status(500).send(err.message);
    }
});

// POST http://localhost:3000/api/books
router.post("/", async (request, response) => {
    try {
        // 1. Create BookModel from 'request.body' / 'Network' tab (in F12 mode) > Filter: 'Fetch/XHR' > 'Payload' tab
        // const book = new BookModel({isbn: "666", title: "The best book ever ever."});
        const book = new BookModel(request.body);

        // 2. Validate the data (will be done later using JOI)

        // 3. Execute 'BookModel.save();' -> Will be granted a new '_id' from the DB
        await book.save();

        // 4. Send back success response. '201' status means CREATED, and we need to convert the 'book' object to a JSON object
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

module.exports = router;