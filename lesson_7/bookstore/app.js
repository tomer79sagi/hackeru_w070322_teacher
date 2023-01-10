const express = require("express");
const server = express();
const bookRouter = require("./routers/bookRouter.js");
require("./dal/dal");

server.use(express.json());
server.use("/api/books", bookRouter); // Router for BOOKS

server.listen(3000, () => console.log("Server started."));