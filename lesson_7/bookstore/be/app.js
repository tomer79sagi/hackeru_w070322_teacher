const express = require("express");
const server = express();
const bookRouter = require("./routers/bookRouter.js");
const  cors = require('cors');
require("./dal/dal");

server.use(express.json());
server.use(cors());
server.use("/api/books", bookRouter); // Router for BOOKS

server.listen(3000, () => console.log("Server started."));