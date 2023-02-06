const express = require("express"); // Assign variable 'express' to ALL properties and functions INSIDE 'express' JS file
const server = express();
const cookieParser = require('cookie-parser');
const bookRouter = require("./routers/bookRouter.js"); // 'bookRouter' gets ALL properties and functions that 'bookRouter.js' EXPORTS
const authRouter = require("./routers/authRouter");
const cors = require('cors');
const verify_logged_in = require("./middleware/verify_logged_in.js");
require("./dal/dal"); // Purely copy/paste of JS code

// 'server' adds middelwares in order of appearance
server.use(express.json());
server.use(cors());

// Ready for endpoint processing (past JSON and CORS middlewares)
// server.use(verify_logged_in); // Use 'verify_logged_in' middleware for ALL endpoints
server.use("/api/auth", authRouter); // Authentication
server.use("/api/books", bookRouter); // Router for BOOKS - This object can execute router.put, router.post, router.get...

server.listen(3000, () => console.log("Server started."));

// server.use(cookieParser());