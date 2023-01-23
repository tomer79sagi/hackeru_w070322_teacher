const express = require("express"); // Assign variable 'express' to ALL properties and functions INSIDE 'express' JS file
const server = express();
const bookRouter = require("./routers/bookRouter.js"); // 'bookRouter' gets ALL properties and functions that 'bookRouter.js' EXPORTS
const cors = require('cors');
require("./dal/dal"); // Purely copy/paste of JS code

server.use(express.json());
server.use(cors());
server.use("/api/books", bookRouter); // Router for BOOKS - This object can execute router.put, router.post, router.get...

server.listen(3000, () => console.log("Server started."));