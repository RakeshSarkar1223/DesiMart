const userServices = require('../services/user.service');


const registerUser = async (req, res) => {
    try{
        const userData = req.body;
        userData.file = req.file;
        const result = await userServices.registerUser(userData);
        res.cookie("token", result.token, { httpOnly: true});
        res.status(201).json(result.user);
    }catch(error){
        console.error("Error in registerUser controller:", error);
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    try{
        const {email, password, role} = req.body;
        const result = await userServices.loginUser(email, password, role);
        res.cookie("token", result.token, { httpOnly: true});
        res.status(200).json(result.user);
    }catch(error){
        console.error("Error in loginUser controller:", error);
        res.status(401).json({ message: error.message });
    }
}

const logoutUser = (req, res) => {
    if(!req.cookie?.token) res.status(404).json({message: "User not logged in"})
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}

const getCurrentUser =async (req, res) => {
    try{
        const _id = req.user._id || req.user.id;
        const user =await userServices.getCurrentUser(_id);
        res.status(200).json(user);
    }
    catch(error){
        console.error("Error in getCurrentUser controller:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
}

const updateUser = async (req, res) => {
    try{
        const {name} = req.body;
        const _id = req.user._id || req.user.id;
        const file = req.file;
        const result = await userServices.updateUser(_id, name, file);
        res.status(200).json({message: "Profile updated successfully"});
    }
    catch(err){
        console.error("Error in updateUser", err);
        res.status(500).json({message : `Error ${err.message}`});
    }
}

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser, updateUser};