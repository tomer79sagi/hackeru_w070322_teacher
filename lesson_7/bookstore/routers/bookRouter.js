const express = require("express");
const router = express.Router();
const fs = require("fs");
const BookModel = require("../models/bookModel");

// GET http://localhost:3000/api/books
router.get("/", async (request, response) => {

    const books = await BookModel.find();
    response.json(books);

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