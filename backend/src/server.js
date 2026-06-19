const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./utils/connect");

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());

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