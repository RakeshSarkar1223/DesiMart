const userControllers = require("../controllers/user.controller");
const authorize = require("../middlewares/authorize")
const authenticate = require("../middlewares/authenticate")
const upload = require("../middlewares/upload")


const express = require('express')

const Router = express.Router();

Router.post("/register",upload.single("photo"), userControllers.registerUser);
Router.post("/login", userControllers.loginUser);
Router.get("/logout", userControllers.logoutUser);
Router.get("/prifile", authenticate, userControllers.getCurrentUser);
Router.put("/update",authenticate, upload.single("photo"), userControllers.updateUser);



module.exports = Router;