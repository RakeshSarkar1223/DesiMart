const userControllers = require("../controllers/user.controller");
const authorize = require("../middlewares/authorize")
const authenticate = require("../middlewares/authenticate")
const upload = require("../middlewares/upload")
const { generateToken } = require("../utils/jwt.utils");


const express = require('express')
const passport = require("passport");

const Router = express.Router();

// Google OAuth routes
Router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
Router.get("/auth/google/callback", 
    passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173" }),
    userControllers.googleLoginUser
);

Router.post("/register",upload.single("photo"), userControllers.registerUser);
Router.post("/login", userControllers.loginUser);
Router.get("/logout", userControllers.logoutUser);
Router.get("/profile", authenticate, userControllers.getCurrentUser);
Router.put("/update",authenticate, upload.single("photo"), userControllers.updateUser);



module.exports = Router;