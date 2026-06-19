const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
require("./config/passport");
const connectDB = require("./utils/connect");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Initialize passport
app.use(passport.initialize());

// Custom cookie compatibility layer
app.use((req, res, next) => {
    req.cookie = req.cookies;
    next();
});

// Connect to MongoDB   
connectDB(process.env.MONGO_URI);

// Routes
app.get("/test", (req, res) => {
    res.status(200).json({ message: "API is working!" });
});


app.use("/api/v1", require("./routes/user.route"));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});