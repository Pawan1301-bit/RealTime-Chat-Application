const express = require('express');
const { chats } = require('./data/data.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require("./config/db.js");
const userRoutes = require('./routers/userRoutes');
const chatRoutes = require('./routers/chatRoutes');
const {errorHandler, notFound} = require('./Middleware/errorMiddleware.js');
require('dotenv').config();


const app = express();
connectDB();

// Middleware (must come BEFORE route usage)
app.use(cors());
app.use(express.json());             // built-in body parser
app.use(bodyParser.json());         // optional, express.json is enough in most cases

// Routes to handle with path start with api/user
app.use('/api/user', userRoutes);   
app.use("/api/chat", chatRoutes);   
//adding middleware's to handle user not found and handling errors 
app.use(notFound);
app.use(errorHandler);

// Simple route
app.get('/', (req, res) => {
    res.send("Hello World");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
