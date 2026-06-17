const User = require("../models/user.model");
const { generateToken , verifyToken} = require("../utils/jwt.utils");
const {hashPassword, comparePassword} = require("../utils/password");

const registerUser = async (userData) => {
    const {name, email, password, role, } = userData;